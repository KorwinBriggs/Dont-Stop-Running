
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
    body: document.getElementById("character"),
    head: document.getElementById("head"), 
    torso: document.getElementById("torso"), 
    hips: document.getElementById("hips"), 
    bicepR: document.getElementById("bicep-right"), 
    forearmR: document.getElementById("forearm-right"), 
    bicepL: document.getElementById("bicep-left"), 
    forearmL: document.getElementById("forearm-left"), 
    thighR: document.getElementById("thigh-right"), 
    shinR: document.getElementById("shin-right"), 
    footR: document.getElementById("foot-right"), 
    thighL: document.getElementById("thigh-left"), 
    shinL: document.getElementById("shin-left"), 
    footL: document.getElementById("foot-left"), 

    test: () => {console.log("success")},

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
let running = false;

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
}

//CHARACTER SELECT -----------------------------------------

nextCharButton.addEventListener("click", () => {
    //slide character off left, new character in from right
    //slide background to match
    console.log("Next Character");
})

prevCharButton.addEventListener("click", () => {
    //slide character off right, new character in from left
    //slide background to match
    console.log("Previous Character");
});

//RUNNING/ETC ----------------------------------------------

runButton.addEventListener("mousedown", () => {
    //set running to true
    //start run animation
});

const run = () => {
    //on buttonpress run
    //character.run
    //background.scroll
    //move character select left, 
    //bring score in from right
}

const fall = () => {
    //on butten release run
    //character.fall, move offscreen
    //reposition as next character, scroll in
    //also scroll in character select, game title
    //background.scroll to match
}


