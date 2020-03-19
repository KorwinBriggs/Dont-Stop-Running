
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
    0: document.getElementById("bg__layer0"),
    1: document.getElementById("bg__layer1"),
    2: document.getElementById("bg__layer2"),
    3: document.getElementById("bg__layer3"),
    all: document.getElementsByClassName("bg"),

    scroll: (direction, speed) => {
        //move backgrounds at different rates for paralax
        //handle infinite scrolling
    },
}

//character pieces/animations
const character = {

    body: document.getElementById("character"), // for moving full character

    //skeleton = blank divs arranged by joint, no images
    skeleton: {
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
        if (imageStyle.transform != boneStyle.transform) image.style.transform = boneStyle.transform;
        if (imageStyle.height != boneStyle.height) image.style.height = boneStyle.height;
        if (imageStyle.width != boneStyle.width) image.style.width = boneStyle.width;

        let boneTop = bone.getBoundingClientRect().top + window.scrollY + "px";
        if (image.style.top != boneTop) image.style.top = boneTop;

        let boneLeft = bone.getBoundingClientRect().left + window.scrollX + "px";
        if (image.style.left != boneLeft) image.style.left = boneLeft;

        //problem is that all the tops and lefts are relative to their parents, 
        //which are often relative to their parents
        //how to solve?
        //simplify the image
        //take graphics out of character; let them sit at root window
        //then just move them to be
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

    stand: () => {
        //animation for standing goes here
    },

    run: () => {
        //animation for running goes here
    },

    fall: () => {
        //animation for falling goes here
    },

    flail: () => {
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

character.matchSkeleton();


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
