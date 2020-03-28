
/*

app should start with everything off-screen,
just sky background.

Then bring in Don't Stop Running! title
from bottom of screen, panning sky a little behind
it (parallaxally).

If not loaded in that time, fade in loading image
Once loaded, fade out loading image, and pan
bg elements and character and character select and
buttons up from bottom of screen. Character should
be in idle (read: terrified) animation.

Right and left arrows cycle characters, rolling 
character out in one direction and bringing next one
in from opposite direction, and panning bg along
with it.

hitting RUN!! should 
*/
"use strict"

//CONST's ---------------------------------

//background pieces
const bg = {
    all: document.getElementsByClassName("bg"),

    layer0: document.getElementById("bg__layer0"),
    layer0X: 0,
    layer0ratio: 1597/1108,

    layer1: document.getElementById("bg__layer1"),
    layer1X: 0,
    layer1ratio: 7670/2216,

    layer2: document.getElementById("bg__layer2"),
    layer2X: 0,
    layer2ratio: 7670/2216,

    layer3: document.getElementById("bg__layer3"),
    layer3X: 0,
    layer3ratio: 3329/321,


    getWidths: () => { //to be called on resizing the window
        bg.layer0height = getComputedStyle(bg.layer0).height.slice(0,-2);
        bg.layer0width = bg.layer0height * bg.layer0ratio;
        bg.layer1height = getComputedStyle(bg.layer1).height.slice(0,-2);
        bg.layer1width = bg.layer1height * bg.layer1ratio;
        bg.layer2height = getComputedStyle(bg.layer2).height.slice(0,-2);
        bg.layer2width = bg.layer2height * bg.layer2ratio;
        bg.layer3height = getComputedStyle(bg.layer3).height.slice(0,-2);
        bg.layer3width = bg.layer3height * bg.layer3ratio;
    },


    getPositions: () => {
        let widths = [bg.layer0width, bg.layer1width, bg.layer2width, bg.layer3width]

        let positions = [
            getComputedStyle(bg.layer0).backgroundPositionX.slice(0,-2),
            getComputedStyle(bg.layer1).backgroundPositionX.slice(0,-2),
            getComputedStyle(bg.layer2).backgroundPositionX.slice(0,-2),
            getComputedStyle(bg.layer3).backgroundPositionX.slice(0,-2)
        ]

        for (let i = 0; i < 4; i++) {  //resetting positions closer to zero if they're many multiples of their widths
            if ( positions[i] > widths[i] || positions[i] < -(widths[i]) ) {
                positions[i] = positions[i] % widths[i];
            }
        }

        bg.layer0X = positions[0];
        bg.layer1X = positions[1];
        bg.layer2X = positions[2];
        bg.layer3X = positions[3];

        bg.layer0.style.backgroundPositionX = positions[0] + "px";
        bg.layer1.style.backgroundPositionX = positions[1] + "px";
        bg.layer2.style.backgroundPositionX = positions[2] + "px";
        bg.layer3.style.backgroundPositionX = positions[3] + "px";
    },


    scroll: (tl, ease, fraction) => {
        //should get current x's, advance background relative to them for distance and duraction of fraction
        tl.to(bg.layer0, {backgroundPositionX: (-(bg.layer0width) + bg.layer0X) * fraction + "px", ease: ease, duration: (10 * fraction), })
        .to(bg.layer1, {backgroundPositionX: (-(bg.layer1width) + bg.layer1X) * fraction + "px", ease: ease, duration: (10 * fraction)}, '-=' + (10 * fraction) )
        .to(bg.layer2, {backgroundPositionX: (-(bg.layer2width*2) + bg.layer2X) * fraction + "px", ease: ease, duration: (10 * fraction)}, '-=' + (10 * fraction) )
        .to(bg.layer3, {backgroundPositionX: (-(bg.layer3width*5) + bg.layer3X) * fraction + "px", ease: ease, duration: (10 * fraction)}, '-=' + (10 * fraction) );
    },

    scrollStart: (tl) => { 
        if (tl) {
            tl.start();
            return tl;
        } else {
            let tl = gsap.timeline({repeat:-1});
            bg.scroll(tl, "none", 1)
            return tl;
        }
    },

    //new idea:
    //just start the animation, and pause it immediately
    //then either run, pause, or rewind it as necessary throughout app

    /*
        So, I can have the background running
        then on stopbackground, get its current bg-location, and start a new
        partial animation that moves it only a little bit forward, stopping with an ease
        and then record the new bglocation for use in starting again
    */

    scrollStop: (tl) => {

        tl.kill();
        bg.getPositions();
        let tl2 = gsap.timeline({repeat:1});
        bg.scroll(tl2, "sine.out", .5)
        return tl2;

    }
}


//character pieces/animations
const character = {


    //skeleton = blank divs arranged by joint, no images
    skeleton: {
        all: document.getElementById("skeleton"),
        torso: document.getElementById("skeleton__torso"),
        head: document.getElementById("skeleton__head"), 
        eyes: document.getElementById("skeleton__eyes"), 
        bicepR: document.getElementById("skeleton__bicep-right"), 
        forearmR: document.getElementById("skeleton__forearm-right"), 
        bicepL: document.getElementById("skeleton__bicep-left"), 
        forearmL: document.getElementById("skeleton__forearm-left"), 
        thighR: document.getElementById("skeleton__thigh-right"), 
        shinR: document.getElementById("skeleton__shin-right"), 
        footR: document.getElementById("skeleton__foot-right"), 
        thighL: document.getElementById("skeleton__thigh-left"), 
        shinL: document.getElementById("skeleton__shin-left"), 
        footL: document.getElementById("skeleton__foot-left"), 
    },

    //image = images, arranged by depth from screen
    //in order to overcome the vagueries of inheritance and z-axis.
    image: {
        all: document.getElementById("character"),
        torsoF: document.getElementById("graphic__torso-front"),
        torsoB: document.getElementById("graphic__torso-back"),
        head: document.getElementById("graphic__head"), 
        eyes: document.getElementById("graphic__eyes"),
        mouth: document.getElementById("graphic__mouth"),
        bicepR: document.getElementById("graphic__bicep-right"), 
        forearmR: document.getElementById("graphic__forearm-right"), 
        bicepL: document.getElementById("graphic__bicep-left"), 
        forearmL: document.getElementById("graphic__forearm-left"), 
        thighR: document.getElementById("graphic__thigh-right"), 
        shinR: document.getElementById("graphic__shin-right"), 
        footR: document.getElementById("graphic__foot-right"), 
        thighL: document.getElementById("graphic__thigh-left"), 
        shinL: document.getElementById("graphic__shin-left"), 
        footL: document.getElementById("graphic__foot-left"), 
    },

    matchBone: (image, bone) => {
        //helper function, 
        //check if image is in same location as bone
        //if not, move to match
        let boneStyle = getComputedStyle(bone);
        let imageStyle = getComputedStyle(image);
        if (imageStyle.height != boneStyle.height) image.style.height = boneStyle.height;
        if (imageStyle.width != boneStyle.width) image.style.width = boneStyle.width;

        const matrixToDeg = (matrix) => { //paraphrased from function found on the internet
            if(matrix !== 'none') {
                var values = matrix.split('(')[1].split(')')[0].split(',');
                var a = values[0];
                var b = values[1];
                var angle = Math.atan2(b, a) ;
            } else { var angle = 0; }
            return angle;
        }

        const getCombinedRotation = (bone) => {
            let angle = matrixToDeg(getComputedStyle(bone).transform);
            if(bone.parentNode.id != "action") angle = angle + getCombinedRotation(bone.parentNode);
            return angle;
        }

        const radToDeg = (radians) => {
            return radians * (180/Math.PI)
        }

        const getCombinedTop = (bone) => {
            let total = 0;
            total += parseFloat(getComputedStyle(bone).top);
            if(bone.parentNode.id != "action") total = total + getCombinedTop(bone.parentNode);
            return total;
        }

        const getCombinedLeft = (bone) => {
            let total = 0;
            total += parseFloat(getComputedStyle(bone).left);
            if(bone.parentNode.id != "action") total = total + getCombinedLeft(bone.parentNode);
            // total += getComputedStyle(character.skeleton.all).width/2
            return total;
        }


        // let currentRotation = getCombinedRotation(bone);
        image.style.transform = "rotate(" + radToDeg(getCombinedRotation(bone)) + "deg)";

        // const getOffsetY = (width, height, rotation) => {
        //     let angle = Math.tan(width/height);
        //     let trigOffset = (1-Math.sin(angle)) * (width/Math.sin(angle));
        //     let sidesOffset = (height-width) / 2
        //     return currentDifference;
        // }

        image.style.top = getCombinedTop(bone) + 'px';
        image.style.left = getCombinedLeft(bone) + 'px';
    },

    matchSkeleton: () => {
        let image = character.image;
        let skeleton = character.skeleton;
        //match all images to all bones
        character.matchBone(image.torsoF, skeleton.torso);
        character.matchBone(image.torsoB, skeleton.torso);
        character.matchBone(image.head, skeleton.head);
        character.matchBone(image.mouth, skeleton.head);
        character.matchBone(image.eyes, skeleton.eyes);
        character.matchBone(image.bicepR, skeleton.bicepR);
        character.matchBone(image.forearmR, skeleton.forearmR);
        character.matchBone(image.bicepL, skeleton.bicepL);
        character.matchBone(image.forearmL, skeleton.forearmL);
        character.matchBone(image.thighR, skeleton.thighR);
        character.matchBone(image.shinR, skeleton.shinR);
        character.matchBone(image.footR, skeleton.footR);
        character.matchBone(image.thighL, skeleton.thighL);
        character.matchBone(image.shinL, skeleton.shinL);
        character.matchBone(image.footL, skeleton.footL);
        
    },

    /* ANIMATION NOTES: 
        I'll have to do a lot of this by trail and error, but in general:
        it should all work on a timeline that repeats every second
        standing: two bounces, shivering hands, plus a randomly-generated left/right glance every second or so
        running: one cycle, leftleg-rightleg
        flailing: randomly swing each arm in a direction ~four times
    */

    stand: (speed) => {
        //animation for standing goes here
        //should be built of several modular parts: legs, torso, etc on a half-second timeframe
        let {torso, head, eyes, bicepR, bicepL, forearmR, forearmL, thighL, thighR, shinL, shinR, footL, footR} = character.skeleton;
        let ease = "power1.inOut"

        let stand = gsap.timeline( {repeat: 0} ); 

        let key1 = gsap.timeline( {repeat:0} ); //less crouched

            //torso/head
            key1.to(torso, {rotation:10, bottom:"33%", left:"32.5%", duration:speed, ease: ease});
            key1.to(head, {rotation:-5, duration:speed, ease: ease}, '-=' + speed);
            
            //legs
            key1.to(thighL, {rotation:-25, duration:speed, ease: ease}, '-=' + speed);
            key1.to(shinL, {rotation:30, duration:speed, ease: ease}, '-=' + speed);
            key1.to(footL, {rotation:-15, duration:speed, ease: ease}, '-=' + speed);

            key1.to(thighR, {rotation:-20, duration:speed, ease: ease}, '-=' + speed);
            key1.to(shinR, {rotation:25, duration:speed, ease: ease}, '-=' + speed);
            key1.to(footR, {rotation:-6, duration:speed, ease: ease}, '-=' + speed);
            
            //arms
            key1.to(bicepL, {rotation:-10, duration:speed, ease: ease}, '-=' + speed);
            key1.to(forearmL, {rotation:-40, duration:speed, ease: ease}, '-=' + speed);

            key1.to(bicepR, {rotation:20, duration:speed, ease: ease}, '-=' + speed);
            key1.to(forearmR, {rotation:-40, duration:speed, ease: ease}, '-=' + speed);

        let key2 = gsap.timeline( {repeat:-1, yoyo: true} ); //more crouched

            //torso/head
            key2.to(torso, {rotation:15, bottom:"32.5%", left:"32%", duration:speed, ease: ease});
            key2.to(head, {rotation:-10, duration:speed, ease: ease}, '-=' + speed);
            
            //legs
            key2.to(thighL, {rotation:-35, duration:speed, ease: ease}, '-=' + speed);
            key2.to(shinL, {rotation:35, duration:speed, ease: ease}, '-=' + speed);
            key2.to(footL, {rotation:-15, duration:speed, ease: ease}, '-=' + speed);

            key2.to(thighR, {rotation:-30, duration:speed, ease: ease}, '-=' + speed);
            key2.to(shinR, {rotation:30, duration:speed, ease: ease}, '-=' + speed);
            key2.to(footR, {rotation:-6, duration:speed, ease: ease}, '-=' + speed);
            
            //arms
            key2.to(bicepL, {rotation:-10, duration:speed, ease: ease}, '-=' + speed);
            key2.to(forearmL, {rotation:-40, duration:speed, ease: ease}, '-=' + speed);

            key2.to(bicepR, {rotation:20, duration:speed, ease: ease}, '-=' + speed);
            key2.to(forearmR, {rotation:-40, duration:speed, ease: ease}, '-=' + speed);

        let eyeMove = gsap.timeline( {repeat: -1} );
        function randomEye(tl) {
            tl.to(eyes, { 
                left:(Math.random() - .5) * 5 + '%',
                top: (Math.random() - .5) * 2.5 + '%',
                onComplete: function() {
                    this.kill();
                    randomEye(tl);
                }
            }, .5 );
        };

        // let shiver = gsap.timeline( {repeat: -1} );
        

        stand.add(randomEye(eyeMove));
        stand.add(key1, 0);
        stand.add(key2, ">");

    },

    run: (speed) => {
        //animation for running goes here
    },

    fall: (speed) => {
        //animation for falling goes here
    },

    flail: (speed) => {
        //arms animation - semi-randomly sends arms waggling
        //aim for inflatable tube man
    },

    yell: () => {
        //animate mouth, 
        //but leave spawning 'AAAA' particles to button function
    },

    cry: () => {
        //animate eyes,
        //but leave spawning tear particles to button function
    },
}

//word pieces and buttons
const titleDisplay = document.getElementById("game-title");
const scoreDisplay = document.getElementById("score");

const charSelectMenu = document.getElementById("char-select-menu");
const nextCharButton = document.getElementById("charselect__right");
const prevCharButton = document.getElementById("charselect__left");

const runButton = document.getElementById("control__run");
const flailButton = document.getElementById("control__flail");
const eyesButton = document.getElementById("control__eyes");
const yellButton = document.getElementById("control__yell");
const cryButton = document.getElementById("control__cry");

//GAME functions -------------------------------------------

bg.getPositions();
bg.getWidths();
character.matchSkeleton(); //setup stuff

let running = false; //for tracking mouseUps that might be outside button 
let gameReady = false; //for disabling running until game is set/reset

const loadingImage = () => {
    //loader animation
    //on dark background, with a single set of scared eyes
    //and the word 'loading' animated above
}

//on load, remove preloader and bring in beginning screen
window.onload = () => {
    //
    //animate character select/title/etc
    //up from bottom 
    //at end, set gameREady to true
    gameReady = true;
}

//CHARACTER SELECT -----------------------------------------

nextCharButton.addEventListener("click", () => {
    //slide character off left, 
    //change class from ex man to woman
    //new character in from right
    //slide background to match
    console.log("Next Character");
})

prevCharButton.addEventListener("click", () => {
    //slide character off right, 
    //change class from ex man to woman
    //new character in from left
    //slide background to match
    console.log("Previous Character");
});

//RUNNING/ETC ----------------------------------------------

runButton.addEventListener("mousedown", () => {
    if (gameReady == true) {
        running = true;
        console.log("Running:", running)
        //set running to true, for later mouse-up stuff
        //start run animation
        //character.run
        //background.scroll
        //move character select left, 
        //bring score in from right
    }
});

window.addEventListener("mouseup", () => {
    if (running == true) {
        running = false;
        gameReady = false;
        console.log("Running:", running)
        //character.fall, move offscreen
        //reposition as next character, scroll in
        //also scroll in character select, game title
        //background.scroll to match
    }
})

//OTHER BUTTONS --------------------------------------------

flailButton.addEventListener("click", () => {
    //trigger flail animation
    console.log("Flail");
});

cryButton.addEventListener("click", () => {
    //trigger cry animation
    //spawn tears that splash on ground
    console.log("Cry");
});

eyesButton.addEventListener("click", () => {
    //black out everything
    //except eyes and an open eyes button
    console.log("Eyes");
});

yellButton.addEventListener("click", () => {
    //trigger yell animation
    //spawn letters for yell
    console.log("Yell");
});


let tl = gsap.timeline( {repeat:-1});
tl.to(character.skeleton.torso, {rotation:360, ease: "none", duration:10})
setInterval(function() {character.matchSkeleton()}, 40)
// character.stand(.75);

