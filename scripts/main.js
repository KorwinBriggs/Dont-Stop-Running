
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
    layer0ratio: 1597/1108,

    layer1: document.getElementById("bg__layer1"),
    layer1ratio: 7670/2216,

    layer2: document.getElementById("bg__layer2"),
    layer2ratio: 7670/2216,

    layer3: document.getElementById("bg__layer3"),
    layer3ratio: 3329/321,

    getWidths: () => { //gets background image widths based on heights, 
                       //to be called on on load and on resizing the window
        bg.layer0height = getComputedStyle(bg.layer0).height.slice(0,-2);
        bg.layer0width = bg.layer0height * bg.layer0ratio;
        bg.layer1height = getComputedStyle(bg.layer1).height.slice(0,-2);
        bg.layer1width = bg.layer1height * bg.layer1ratio;
        bg.layer2height = getComputedStyle(bg.layer2).height.slice(0,-2);
        bg.layer2width = bg.layer2height * bg.layer2ratio;
        bg.layer3height = getComputedStyle(bg.layer3).height.slice(0,-2);
        bg.layer3width = bg.layer3height * bg.layer3ratio;
    },

    preventOverflow: () => { //used to reset position closer to 0, without visible changes, to prevent
                            //javascript from sending some weird e-notation numbers
        let layers = [bg.layer0, bg.layer1, bg.layer2, bg.layer3];
        let widths = [bg.layer0width, bg.layer1width, bg.layer2width, bg.layer3width];
        for (let i = 0; i < 4; i++) {
            layers[i].style.backgroundPositionX = (parseFloat(layers[i].style.backgroundPositionX) % widths[i]) + 'px';
        }
    },

    scroll: (ease, distance, duration) => {
        //tl is a timeline, ease is ease, distance is percent of one full loop, duration is seconds
        let tl = gsap.timeline();
        tl.to(bg.layer0, {backgroundPositionX: ("-=" + ((bg.layer0width) / 100) * distance + "px"), ease: ease, duration: duration })
        .to(bg.layer1, {backgroundPositionX: ("-=" + ((bg.layer1width) / 100) * distance + "px"), ease: ease, duration: duration }, '-=' + duration )
        .to(bg.layer2, {backgroundPositionX: ("-=" + ((bg.layer2width*2) / 100) * distance + "px"), ease: ease, duration: duration }, '-=' + duration )
        .to(bg.layer3, {backgroundPositionX: ("-=" + ((bg.layer3width*6) / 100) * distance + "px"), ease: ease, duration: duration }, '-=' + duration )
        // .call(bg.preventOverflow, []);
        return tl;
    },

    stop: () => { //kills all tweens on character parts
        let parts = Object.values(character.skeleton);
        for (let part of [bg.layer0, bg.layer1, bg.layer2, bg.layer3]) {
            gsap.killTweensOf(part);
        }
    },

}


//character pieces/animations
const character = {

    skeleton: {
        all: document.getElementById("character"),
        torso: document.querySelectorAll(".bone.torso")[0],
        head:  document.querySelectorAll(".bone.head")[0],
        eyes:  document.querySelectorAll(".bone.eyes")[0],
        mouth:  document.querySelectorAll(".bone.mouth")[0],
        bicepR:  document.querySelectorAll(".bone.bicep-right")[0],
        forearmR:  document.querySelectorAll(".bone.forearm-right")[0],
        bicepL:  document.querySelectorAll(".bone.bicep-left")[0],
        forearmL: document.querySelectorAll(".bone.forearm-left")[0],
        thighR: document.querySelectorAll(".bone.thigh-right")[0],
        shinR: document.querySelectorAll(".bone.shin-right")[0],
        footR: document.querySelectorAll(".bone.foot-right")[0],
        thighL: document.querySelectorAll(".bone.thigh-left")[0],
        shinL: document.querySelectorAll(".bone.shin-left")[0],
        footL: document.querySelectorAll(".bone.foot-left")[0],
    },

    image: {
        torsoF: document.querySelectorAll(".image.torso-front")[0],
        torsoB: document.querySelectorAll(".image.torso-back")[0],
        head:  document.querySelectorAll(".image.head")[0],
        eyes:  document.querySelectorAll(".image.eyes")[0],
        mouth:  document.querySelectorAll(".image.mouth")[0],
        bicepR:  document.querySelectorAll(".image.bicep-right")[0],
        forearmR:  document.querySelectorAll(".image.forearm-right")[0],
        bicepL:  document.querySelectorAll(".image.bicep-left")[0],
        forearmL: document.querySelectorAll(".image.forearm-left")[0],
        thighR: document.querySelectorAll(".image.thigh-right")[0],
        shinR: document.querySelectorAll(".image.shin-right")[0],
        footR: document.querySelectorAll(".image.foot-right")[0],
        thighL: document.querySelectorAll(".image.thigh-left")[0],
        shinL: document.querySelectorAll(".image.shin-left")[0],
        footL: document.querySelectorAll(".image.foot-left")[0],
    },

    switchCharacter: (oldName, newName) => {
        let parts = Object.values(character.image);
        for (let part of parts) {
            part.classList.remove(oldName);
            part.classList.add(newName);
        }
    },

    /* ANIMATION NOTES: 
        I'll have to do a lot of this by trail and error, but in general:
        it should all work on a timeline that repeats every second
        standing: two bounces, shivering hands, plus a randomly-generated left/right glance every second or so
        running: one cycle, leftleg-rightleg
        flailing: randomly swing each arm in a direction ~four times
    */

    stop: () => { //kills all tweens on character parts
        let parts = Object.values(character.skeleton);
        for (let part of parts) {
            gsap.killTweensOf(part);
        }
    },

    stand: (speed) => {
        //declaring variables
        const {all, torso, head, eyes, mouth, bicepR, bicepL, forearmR, forearmL, thighL, thighR, shinL, shinR, footL, footR} = character.skeleton;
        let ease = "power1.inOut"

        let stand = gsap.timeline( {repeat: 0} ); 

        let key1 = gsap.timeline( {repeat:0} ); //less crouched

            //torso/head
            key1.to(torso, {rotation:8, bottom:"32%", left:"31.5%", duration:speed, ease: ease});
            key1.to(head, {rotation:-5, duration:speed, ease: ease}, '-=' + speed);
            
            //legs
            key1.to(thighL, {rotation:-25, duration:speed, ease: ease}, '-=' + speed);
            key1.to(shinL, {rotation:30, duration:speed, ease: ease}, '-=' + speed);
            key1.to(footL, {rotation:-15, duration:speed, ease: ease}, '-=' + speed);

            key1.to(thighR, {rotation:-20, duration:speed, ease: ease}, '-=' + speed);
            key1.to(shinR, {rotation:25, duration:speed, ease: ease}, '-=' + speed);
            key1.to(footR, {rotation:-6, duration:speed, ease: ease}, '-=' + speed);
            
            //arms
            key1.to(bicepL, {rotation:10, duration:speed, ease: ease}, '-=' + speed);
            key1.to(forearmL, {rotation:-50, duration:speed, ease: ease}, '-=' + speed);

            key1.to(bicepR, {rotation:20, duration:speed, ease: ease}, '-=' + speed);
            key1.to(forearmR, {rotation:-40, duration:speed, ease: ease}, '-=' + speed);

        let key2 = gsap.timeline( {repeat:-1, yoyo: true} ); //more crouched

            //torso/head
            key2.to(torso, {rotation:13, bottom:"31.5%", left:"30.5%", duration:speed, ease: ease});
            key2.to(head, {rotation:-10, duration:speed, ease: ease}, '-=' + speed);
            
            //legs
            key2.to(thighL, {rotation:-35, duration:speed, ease: ease}, '-=' + speed);
            key2.to(shinL, {rotation:35, duration:speed, ease: ease}, '-=' + speed);
            key2.to(footL, {rotation:-15, duration:speed, ease: ease}, '-=' + speed);

            key2.to(thighR, {rotation:-30, duration:speed, ease: ease}, '-=' + speed);
            key2.to(shinR, {rotation:30, duration:speed, ease: ease}, '-=' + speed);
            key2.to(footR, {rotation:-6, duration:speed, ease: ease}, '-=' + speed);
            
            //arms
            key2.to(bicepL, {rotation:10, duration:speed, ease: ease}, '-=' + speed);
            key2.to(forearmL, {rotation:-60, duration:speed, ease: ease}, '-=' + speed);

            key2.to(bicepR, {rotation:23, duration:speed, ease: ease}, '-=' + speed);
            key2.to(forearmR, {rotation:-45, duration:speed, ease: ease}, '-=' + speed);

        //Shivering
        let shiver = gsap.timeline( {repeat: 0} );

        function wiggle(tl, target, distance, time) {
            let shake = gsap.timeline( {repeat:-1} );
            shake.to(target, {left:'+=' + distance + '%', duration: time/2});
            shake.to(target, {left:'+=' + (-2*distance) + '%', duration: time/2, yoyo:true});
            tl.add(shake, 0);
        }
        
        //creating a combined shiver that doesn't have him skating all over the place
        wiggle(shiver, bicepL, .5, .2);
        wiggle(shiver, bicepR, .5, .2);
        wiggle(shiver, thighR, -.5, .2);
        wiggle(shiver, thighL, -.5, .2);
        wiggle(shiver, all, .20, .2);

        //adding everything to master stand timeline
        stand.add(key1, 0);
        stand.add(key2, ">");
        stand.add(shiver, 0);

        return stand;

    },

    run: (speed) => {
        const {all, torso, head, eyes, mouth, bicepR, bicepL, forearmR, forearmL, thighL, thighR, shinL, shinR, footL, footR} = character.skeleton;

        // let run = gsap.timeline();
        let runLoop = gsap.timeline( {repeat:-1, repeatRefresh:true} ); //loops through keyframes indefinitely

        let key1 = gsap.timeline();

            let ease1 = "power1.out"

            //torso/head
            key1.to(torso, {rotation:-5, bottom:'39%', duration:speed, ease: ease1});
            key1.to(head, {rotation:10, duration:speed, ease: ease1}, '-=' + speed);
            key1.to(eyes, {left:"1.5%", duration:speed, ease:ease1}, '-=' + speed);
            
            //legs
            key1.to(thighL, {rotation:-40, duration:speed, ease: ease1}, '-=' + speed);
            key1.to(shinL, {rotation:0, duration:speed, ease: ease1}, '-=' + speed);
            key1.to(footL, {rotation:-10, duration:speed, ease: ease1}, '-=' + speed);

            key1.to(thighR, {rotation:38, duration:speed, ease: ease1}, '-=' + speed);
            key1.to(shinR, {rotation:90, duration:speed, ease: ease1}, '-=' + speed);
            key1.to(footR, {rotation:0, duration:speed, ease: ease1}, '-=' + speed);
            
            //arms
            key1.to(bicepL, {rotation:80, duration:speed, ease: "none"}, '-=' + speed);
            key1.to(forearmL, {rotation:-80, duration:speed, ease: "none"}, '-=' + speed);

            key1.to(bicepR, {rotation:-40, duration:speed, ease: "none"}, '-=' + speed);
            key1.to(forearmR, {rotation:-90, duration:speed, ease: "none"}, '-=' + speed);


        const key2 = gsap.timeline();

            let ease2 = "power1.in"

            //torso/head
            key1.to(torso, {rotation:-0, bottom:'-=7%', duration:speed, ease: ease2});
            key1.to(head, {rotation:5, duration:speed, ease: ease2}, '-=' + speed);
            
            //legs
            key1.to(thighL, {rotation:5, duration:speed, ease: ease2}, '-=' + speed);
            key1.to(shinL, {rotation:5, duration:speed, ease: ease2}, '-=' + speed);
            key1.to(footL, {rotation:0, duration:speed, ease: ease2}, '-=' + speed);

            key1.to(thighR, {rotation:-10, duration:speed, ease: ease2}, '-=' + speed);
            key1.to(shinR, {rotation:100, duration:speed, ease: ease2}, '-=' + speed);
            key1.to(footR, {rotation:-10, duration:speed, ease: ease2}, '-=' + speed);
            
            //arms
            key1.to(bicepL, {rotation:20, duration:speed, ease: "none"}, '-=' + speed);
            key1.to(forearmL, {rotation:-80, duration:speed, ease: "none"}, '-=' + speed);

            key1.to(bicepR, {rotation:20, duration:speed, ease: "none"}, '-=' + speed);
            key1.to(forearmR, {rotation:-80, duration:speed, ease: "none"}, '-=' + speed);


        const key3 = gsap.timeline();

            let ease3 = "power1.out"

            //torso/head
            key1.to(torso, {rotation:-5, bottom:'+=7%', duration:speed, ease: ease3});
            key1.to(head, {rotation:10, duration:speed, ease: ease3}, '-=' + speed);
            
            //legs
            key1.to(thighL, {rotation:38, duration:speed, ease: ease3}, '-=' + speed);
            key1.to(shinL, {rotation:90, duration:speed, ease: ease3}, '-=' + speed);
            key1.to(footL, {rotation:0, duration:speed, ease: ease3}, '-=' + speed);

            key1.to(thighR, {rotation:-40, duration:speed, ease: ease3}, '-=' + speed);
            key1.to(shinR, {rotation:0, duration:speed, ease: ease3}, '-=' + speed);
            key1.to(footR, {rotation:-10, duration:speed, ease: ease3}, '-=' + speed);
            
            //arms
            key1.to(bicepL, {rotation:-40, duration:speed, ease: "none"}, '-=' + speed);
            key1.to(forearmL, {rotation:-90, duration:speed, ease: "none"}, '-=' + speed);

            key1.to(bicepR, {rotation:80, duration:speed, ease: "none"}, '-=' + speed);
            key1.to(forearmR, {rotation:-80, duration:speed, ease: "none"}, '-=' + speed);


        const key4 = gsap.timeline();

            let ease4 = "power1.in"

            //torso/head
            key1.to(torso, {rotation:-0, bottom:'-=7%', duration:speed, ease: ease4});
            key1.to(head, {rotation:5, duration:speed, ease: ease4}, '-=' + speed);
            
            //legs
            key1.to(thighL, {rotation:-10, duration:speed, ease: ease4}, '-=' + speed);
            key1.to(shinL, {rotation:100, duration:speed, ease: ease4}, '-=' + speed);
            key1.to(footL, {rotation:-10, duration:speed, ease: ease4}, '-=' + speed);

            key1.to(thighR, {rotation:5, duration:speed, ease: ease4}, '-=' + speed);
            key1.to(shinR, {rotation:5, duration:speed, ease: ease4}, '-=' + speed);
            key1.to(footR, {rotation:0, duration:speed, ease: ease4}, '-=' + speed);
            
            //arms
            key1.to(bicepL, {rotation:20, duration:speed, ease: "none"}, '-=' + speed);
            key1.to(forearmL, {rotation:-80, duration:speed, ease: "none"}, '-=' + speed);

            key1.to(bicepR, {rotation:20, duration:speed, ease: "none"}, '-=' + speed);
            key1.to(forearmR, {rotation:-80, duration:speed, ease: "none"}, '-=' + speed);


        runLoop.add(key1);
        runLoop.add(key2);
        runLoop.add(key3);
        runLoop.add(key4);

        return runLoop;
    },

    lookAround: () => {
        let tl = gsap.timeline( {repeat: -1} );
        function randomEye(tl) {
            tl.to(character.skeleton.eyes, { 
                left:(Math.random() - .5) * 5 + '%',
                top: (Math.random() - .5) * 2.5 + '%',
                overwrite: true,
                onComplete: function() {
                    this.kill();
                    randomEye(tl);
                }
            }, .5 );
        }
        randomEye(tl);
        return tl;
    },

    fall: (speed) => {
        //animation for falling goes here
        let fall = gsap.timeline();


        let key1 = gsap.timeline();

            let ease1 = "power1.out"

            //torso/head
            key1.to(torso, {rotation:-5, bottom:'39%', duration:speed, ease: ease1});
            key1.to(head, {rotation:10, duration:speed, ease: ease1}, '-=' + speed);
            key1.to(eyes, {left:"1.5%", duration:speed, ease:ease1}, '-=' + speed);
            
            //legs
            key1.to(thighL, {rotation:-40, duration:speed, ease: ease1}, '-=' + speed);
            key1.to(shinL, {rotation:0, duration:speed, ease: ease1}, '-=' + speed);
            key1.to(footL, {rotation:-10, duration:speed, ease: ease1}, '-=' + speed);

            key1.to(thighR, {rotation:38, duration:speed, ease: ease1}, '-=' + speed);
            key1.to(shinR, {rotation:90, duration:speed, ease: ease1}, '-=' + speed);
            key1.to(footR, {rotation:0, duration:speed, ease: ease1}, '-=' + speed);
            
            //arms
            key1.to(bicepL, {rotation:80, duration:speed, ease: "none"}, '-=' + speed);
            key1.to(forearmL, {rotation:-80, duration:speed, ease: "none"}, '-=' + speed);

            key1.to(bicepR, {rotation:-40, duration:speed, ease: "none"}, '-=' + speed);
            key1.to(forearmR, {rotation:-90, duration:speed, ease: "none"}, '-=' + speed);

        // let key1 = gsap.timeline();

        //     let ease1 = "power1.out"

        //     //torso/head
        //     key1.to(torso, {rotation:-5, bottom:'39%', duration:speed, ease: ease1});
        //     key1.to(head, {rotation:10, duration:speed, ease: ease1}, '-=' + speed);
        //     key1.to(eyes, {left:"1.5%", duration:speed, ease:ease1}, '-=' + speed);
            
        //     //legs
        //     key1.to(thighL, {rotation:-40, duration:speed, ease: ease1}, '-=' + speed);
        //     key1.to(shinL, {rotation:0, duration:speed, ease: ease1}, '-=' + speed);
        //     key1.to(footL, {rotation:-10, duration:speed, ease: ease1}, '-=' + speed);

        //     key1.to(thighR, {rotation:38, duration:speed, ease: ease1}, '-=' + speed);
        //     key1.to(shinR, {rotation:90, duration:speed, ease: ease1}, '-=' + speed);
        //     key1.to(footR, {rotation:0, duration:speed, ease: ease1}, '-=' + speed);
            
        //     //arms
        //     key1.to(bicepL, {rotation:80, duration:speed, ease: "none"}, '-=' + speed);
        //     key1.to(forearmL, {rotation:-80, duration:speed, ease: "none"}, '-=' + speed);

        //     key1.to(bicepR, {rotation:-40, duration:speed, ease: "none"}, '-=' + speed);
        //     key1.to(forearmR, {rotation:-90, duration:speed, ease: "none"}, '-=' + speed);


        return fall;
    },

    flail: (speed) => {
        //one function adds all tweens, then kills them and adds them again
        //each tween is a function
        let tl = gsap.timeline( {repeat: -1, repeatRefresh: true} );

        let resetRotation = (node) => {
            let currentRotation = parseFloat(node.style.transform.substring(7));
            let newRotation = currentRotation % 360;
            node.style.transform = "rotate(" + newRotation + 'deg)';
        }

        function randomArmL(tl, speed) {
            tl.to(character.skeleton.bicepL, { 
                rotate: '+=' + ((Math.random() * 720) - 360),
                overwrite: true,
                duration: speed,
                ease:"none",
                onComplete: function() {
                    // this.kill();
                }
            }, );
            
            tl.to(character.skeleton.forearmL, { 
                rotate: (Math.random() * -100),
                overwrite: true,
                duration: speed,
                ease:"none",
                onComplete: function() {

                    resetRotation(character.skeleton.bicepL);
                    resetRotation(character.skeleton.forearmL);

                    this.kill();
                    randomArmL(tl, speed);
                }
            }, '-=' + speed );
        }

        function randomArmR(tl, speed) {
            tl.to(character.skeleton.bicepR, { 
                rotate: '+=' + ((Math.random() * 720) - 360),
                overwrite: true,
                duration: speed,
                ease:"none",
                onComplete: function() {
                    // this.kill();
                }
            }, '-=' + speed );
            
            tl.to(character.skeleton.forearmR, { 
                rotate: (Math.random() * -100),
                overwrite: true,
                duration: speed,
                ease:"none",
                onComplete: function() {
                    
                    resetRotation(character.skeleton.bicepR);
                    resetRotation(character.skeleton.forearmR);

                    this.kill();
                    randomArmR(tl, speed);
                }
            }, '-=' + speed );

        }

        randomArmR(tl, speed);
        randomArmL(tl, speed);
        return tl;
        // function randomArm(tl) {
        //     let flail = gsap.timeline( {
        //         repeat: 0, 
        //         repeatRefresh: true, 
        //         onRepeat: function() {
        //             this.kill();
        //             flailAll(tl);
        //     }});

        //     flail.to(character.skeleton.bicepL, {
        //         rotate: (Math.random() * 360) - 180,
        //         overwrite: true
        //     }, speed);

        //     flail.to(character.skeleton.bicepR, {
        //         rotate: (Math.random() * 360) - 180,
        //         overwrite: true
        //     }, '-=' + speed);

        //     flail.to(character.skeleton.forearmR, {
        //         rotate: (Math.random() * -145),
        //         overwrite: true
        //     }, '-=' + speed);

        //     flail.to(character.skeleton.forearmR, {
        //         rotate: (Math.random() * -145),
        //         overwrite: true
        //     }, '-=' + speed);

        // // leftBicep(flail);
        // // rightBicep(flail);
        // // leftForearm(flail);
        // // rightForearm(flail);

        // return flail;

        //periodically rotate biceps anywhere and forearms within a 145 degree arc
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
const preloader = document.getElementById("preloader");

const action = document.getElementById("action");
const controller = document.getElementById("controller");

const topWords = document.getElementById("top-words");
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
const plaque = document.getElementById("control__plaque");

//GAME functions -------------------------------------------
//tracking variables, helper functions, event-listeners

let gameReady = false; //for disabling running until game is set/reset
// let animation = gsap.timeline(); //character animation - to keep all the disparate timelines in one place
let bgAnimation = gsap.timeline({repeat:-1}); //bg animation, for repeating scroll

let running = false; //for tracking mouseUps that might be outside button 
let flailing = false;
let eyesShut = false;
let yelling = false;
let crying = false;



const loadingImage = () => {
    //loader animation
    //on dark background, with a single set of scared eyes
    //and the word 'loading' animated above
}

const fadeIn = () => {
    preloader.style.opacity = 1;
    preloader.style.display = "block";
    let tl = gsap.timeline();
    tl.to(preloader, {opacity:0, duration:1}, .3);
    tl.set(preloader, {display:"none"});
    tl.fromTo(charSelectMenu, {opacity:0, x:"", bottom:"3%"}, {opacity:1, duration:.4}, .7);
    tl.fromTo(topWords, {opacity:0, x:"", bottom:"3%"}, {opacity:1, duration:.4}, .7);
    return tl;
}

// const killAnimations = () => {
//     for (let child of animation.getChildren()) {
//         child.kill();
//     }
// }

const resetGame = () => { //also used on first load
    gsap.killTweensOf("*"); //kill all animations
    fadeIn();
    character.skeleton.all.style.left = parseFloat(getComputedStyle(character.skeleton.all).width) / -2 + "px";
    bg.getWidths();

    character.stand(.25);
    character.lookAround();
    running = false;
    flailing = false;
    eyesShut = false;
    yelling = false;
    crying = false;
    
    gameReady = true;

}

window.oncontextmenu = () => {
    return false;
}

window.onload = () => {
    resetGame();
    //have spotlight flicker on, revealing character, fade up on buttons at same time
}

window.onresize = () => {
    //to fix bug where resizing wouldn't recenter character, 
    //because character's left prop was still being animated
    //but since you shouldn't be able to run and resize the window
    //at the same time, resetting the game seems fine.
    resetGame();
}

//CHARACTER SELECT -----------------------------------------

const characters = ["man", "woman"]
let currentCharacter = 0

// NEXT CHARACTER
nextCharButton.addEventListener("click", () => {
    
    let person = character.skeleton.all;
    let tl = gsap.timeline();

    tl.to(person, {x: "-=" + window.innerWidth, duration: .3});
    tl.call( () => {
        let lastCharacter = currentCharacter;
        currentCharacter++;
        if (currentCharacter >= characters.length) currentCharacter = 0;
        character.switchCharacter(characters[lastCharacter], characters[currentCharacter]);
    })
    tl.set(person, {x: window.innerWidth});
    tl.to(person, {x: 0, duration: .6});
    tl.add(bg.scroll("power2.out", 60, .9), 0);
})

// PREVIOUS CHARACTER
prevCharButton.addEventListener("click", () => {

    let person = character.skeleton.all;
    let tl = gsap.timeline();

    tl.to(person, {x: "+=" + window.innerWidth, duration: .3});
    tl.call( () => {
        let lastCharacter = currentCharacter;
        currentCharacter++;
        if (currentCharacter >= characters.length) currentCharacter = 0;
        character.switchCharacter(characters[lastCharacter], characters[currentCharacter]);
    })
    tl.set(person, {x: -window.innerWidth});
    tl.to(person, {x: 0, duration: .6});
    tl.add(bg.scroll("power2.out", -60, .9), 0);
});

//RUNNING/ETC ----------------------------------------------

runButton.addEventListener("mousedown", () => {
    if (gameReady == true) {
        gsap.to(charSelectMenu, {x: -window.innerWidth, ease:"power0.out", duration:.4});
        gsap.to(topWords, {x: -window.innerWidth, ease:"power0.out", duration:.5});
        console.log("Running:", running);

        // killAnimations();  //cancelled the killed animations because the combined animation looks funnier/more scared
        
        // animation.add(character.run(.17));
        // character.stop();
        // animation.kill();
        // animation.add(character.run(1),">");
        character.run(.17);
        bgAnimation.add(bg.scroll("none", 100, 5));
        //remove character select
        //bring score in from right
        running = true;
    }
});

window.addEventListener("mouseup", () => {
    // if (running == true) {
    //     running = false;
    //     gameReady = false;
    //     console.log("Running:", running)
        //character.fall, move offscreen
        //reposition as next character, scroll in
        //also scroll in character select, game title
        //background.scroll to match
    // }
})

//OTHER BUTTONS --------------------------------------------
let flailTimeline;

flailButton.addEventListener("click", () => {
    if (running) {
        if (!flailing) {
            flailTimeline = gsap.timeline();
            flailTimeline.add(character.flail(.2), 0);
            flailing = true;
            console.log("Flail start");
        }
        else {
            character.stop();
            character.run(.17);
            // flailTimeline.kill();
            flailing = false;
            console.log("Flail stop");
        }
    }
});

cryButton.addEventListener("click", () => {

    //trigger cry animation
    //spawn tears that splash on ground
    console.log("Cry");
});

eyesButton.addEventListener("click", () => {    
    if (!eyesShut) {
        action.style.opacity = 0;
        controller.style.backgroundImage = "none";
        controller.style.borderImage = "none";
        cryButton.style.backgroundImage = "none";
        yellButton.style.backgroundImage = "none";
        flailButton.style.backgroundImage = "none";
        runButton.style.backgroundImage = "none";
        plaque.style.backgroundImage = "none";
        eyesShut = true;
    }
    else {
        action.style.opacity = 1;
        controller.style.backgroundImage = "";
        controller.style.borderImage = "";
        cryButton.style.backgroundImage = "";
        yellButton.style.backgroundImage = "";
        flailButton.style.backgroundImage = "";
        runButton.style.backgroundImage = "";
        plaque.style.backgroundImage = "";
        eyesShut = false;
    }
    //black out everything
    //except eyes and an open eyes button
    console.log("Eyes");
});

yellButton.addEventListener("click", () => {
    if (!yelling) {
        character.image.mouth.className = character.image.mouth.className.replace( /(?:^|\s)mouth(?!\S)/g , 'mouth-big' )
        yelling = true;
    } else {
        character.image.mouth.className = character.image.mouth.className.replace( /(?:^|\s)mouth-big(?!\S)/g , 'mouth' )
        yelling = false;
    }
    //trigger yell animation
    //spawn letters for yell
    console.log("Yell");
});


// let tl = gsap.timeline( {repeat:-1});
// tl.to(character.skeleton.torso, {rotation:360, ease: "none", duration:10})
// setInterval(function() {character.matchSkeleton()}, 40)
// character.stand(.50);
// tl = character.run(.5);

