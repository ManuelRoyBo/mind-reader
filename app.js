"use-strict";
const WAIT_TIME_BETWEEN_MIND_READINGS = 5000; //ms
const FADE_ANIMATION_DURATION = 1000; //ms
const LANGUAGE_DIR = "languages";

let DATA //Not a constant but should be treated as one

const FULLSCREEN_BTN = document.getElementById("fullscreen");
const AGAIN_BTN = document.getElementById("again");
const FORTUNE_H1 = document.getElementById("fortune"); 
const LANGUAGE_SELECT = document.getElementById("language");

let currentLanguage;
const DEFAULT_LANGUAGE = "fr";
const LANGUAGES = {
    "fr": "Français",
    "en": "English",
};  
const STORED_LANGUAGE = localStorage.getItem("selectedLanguage");
if (STORED_LANGUAGE) {
    LANGUAGE_SELECT.value = STORED_LANGUAGE;
    getDATA(STORED_LANGUAGE);
    currentLanguage = STORED_LANGUAGE;
} else {
    getDATA(DEFAULT_LANGUAGE);
    currentLanguage = DEFAULT_LANGUAGE;
}

function setLanguagesSelect() {
    for (const language in LANGUAGES) {
        const option = document.createElement("option");
        option.value = language;
        option.textContent = LANGUAGES[language]; 
        if (language === currentLanguage) {
            option.selected = true;
        }
        LANGUAGE_SELECT.appendChild(option);
    }
}

function setFullScreenButtonnText() {
    FULLSCREEN_BTN.textContent = DATA["fullscreen"];
}

function setAgainButtonText() {
    AGAIN_BTN.textContent = DATA["again-button"];
}

function getDATA(language) {
    fetch(`${LANGUAGE_DIR}/${language}.json`)
    .then((response) => response.json())
    .then((text) => {
        DATA = text;
        onceLanguageLoaded();
    })
    .catch((error) => {
        console.error("Error loading JSON file:", error);
    });
}

function getRandomVision() {
    let visions = DATA["visions"];
    let randomIndex = Math.floor(Math.random() * visions.length);
    return visions[randomIndex];
}

function getRandomRevelation() {
    let revelations = DATA["revelations"];
    let randomIndex = Math.floor(Math.random() * revelations.length);
    return revelations[randomIndex];
}

function fadeIn(div) {
    div.classList.add("fade-in");
    div.classList.remove("fade-out");
}

function fadeOut(div) {
    div.classList.add("fade-out");
    div.classList.remove("fade-in");
}

LANGUAGE_SELECT.addEventListener("change", function() {
    const selectedLanguage = this.value;
    localStorage.setItem("selectedLanguage", selectedLanguage);
    location.reload();
});

AGAIN_BTN.addEventListener("click", function() {
    fadeOut(AGAIN_BTN);
    fadeOut(FORTUNE_H1);
    setTimeout(() => {
        AGAIN_BTN.classList.add("hidden");
        onceLanguageLoaded();
    }, FADE_ANIMATION_DURATION);
});

FULLSCREEN_BTN.addEventListener("click", function() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        document.documentElement.requestFullscreen();
    }
});

//Like a main
function onceLanguageLoaded() {
    setAgainButtonText();
    setFullScreenButtonnText();
    FORTUNE_H1.textContent = DATA["intro-text"];
    fadeIn(FORTUNE_H1);
    let vision = getRandomVision();
    let revelation = getRandomRevelation();
    setTimeout(() => {
        fadeOut(FORTUNE_H1);
    
    setTimeout(() => {
        FORTUNE_H1.textContent = vision;
        fadeIn(FORTUNE_H1);
    }, FADE_ANIMATION_DURATION);

    setTimeout(() => {
        fadeOut(FORTUNE_H1);
    }, WAIT_TIME_BETWEEN_MIND_READINGS-FADE_ANIMATION_DURATION);

    setTimeout(() => {
        FORTUNE_H1.textContent = revelation;
        fadeIn(FORTUNE_H1);
    
    setTimeout(() => {
        AGAIN_BTN.classList.remove("hidden");
        fadeIn(AGAIN_BTN);  
    }, FADE_ANIMATION_DURATION);
    }, WAIT_TIME_BETWEEN_MIND_READINGS);
    }, WAIT_TIME_BETWEEN_MIND_READINGS-FADE_ANIMATION_DURATION);
}

setLanguagesSelect();
