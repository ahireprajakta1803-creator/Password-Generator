const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const symbolsCheck = document.querySelector("#symbols");
const numbersCheck = document.querySelector("#numbers");

const lengthDisplay = document.querySelector("#lengthValue");

const inputSlider = document.querySelector("[dataLengthSlider]");

const generateBtn = document.querySelector("#generateBtn");

const passwordDisplay = document.querySelector("#passwordText");

const passwordStrengthIndicator = document.querySelector(".strength-bar");

//Icon Of Mode
const themeIcon = document.querySelector("#themeIcon");

const iconBtn = document.querySelector(".dark-mode-symbol");

//const root = document.querySelector(":root");
const root = document.documentElement;

const copyBtn = document.querySelector("#copyBtn");

const symbols = "!@#$%^&*()_+-<>?:[]{}\/";
//Utility Functions
//Number
function getRandomInteger(min, max) {
    //min = 1, max=9 -> floor(0.6 * (9-1)) + 1
    //floor(4.8)+1 => 4 + 1 = 5
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRandomInteger(0, 10);
}

//Lower case
function generateLowerCase() {
    let randomDecimalNumber = getRandomInteger(97, 123);
    return String.fromCharCode(randomDecimalNumber);
}

function generateUpperCase() {
    let randomDecimalNumber = getRandomInteger(65, 91);
    return String.fromCharCode(randomDecimalNumber);
}

//Special Characters
function generateSymbol() {
    let randomDecimalNumber = getRandomInteger(0, symbols.length);
    return symbols.charAt(randomDecimalNumber);
}

//Setting Default Value of password length to 10
let passwordLength = 10;

//Initial value in html is 1 thats why changing to 10 by calling function
handleSlider(); //call

//function which will handle password length and slider movement
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.textContent = passwordLength;
}

let checkboxCheckedCount = 0;
//checkbox count
handleCheckboxChange();
function handleCheckboxChange() {
    checkboxCheckedCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkboxCheckedCount++;
        }

        //if length = 1 and checkbox selected are 4
        if (passwordLength < checkboxCheckedCount) {
            passwordLength = checkboxCheckedCount;
            handleSlider();
        }
    });
}

//Shuffle Password
function shufflePassword(passwordArray) {
    for (let i = passwordArray.length - 1; i > 0; i--){
        //Generate random index -> swap
        let j = Math.floor(Math.random() * (i + 1));

        //swap
        let temp = passwordArray[i];
        passwordArray[i] = passwordArray[j];
        passwordArray[j] = temp;
    }
    let stringPassword = "";
    passwordArray.forEach((singleChar) => {
        stringPassword = stringPassword + singleChar; 
    });
    return stringPassword;
}

function setIndicatorColor(color) {
    passwordStrengthIndicator.style.background = color;

    passwordStrengthIndicator.style.boxShadow = "0px 0px 10px 1px";
}

function calculateStrength() {
    let isUpper = false;
    let isLower = false;
    let isSymbol = false;
    let isNumber = false;

    if (upperCaseCheck.checked) {
        isUpper = true;
    }
    if (lowerCaseCheck.checked) {
        isLower = true;
    }
    if (symbolsCheck.checked) {
        isSymbol = true;
    }
    if (numbersCheck.checked) {
        isNumber = true;
    }
    if (isLower && isUpper && (isSymbol || isNumber) && passwordLength >= 8) {
        setIndicatorColor("green");
    } else if ((isLower || isUpper) && (isSymbol || isNumber) && passwordLength > 6) {
        setIndicatorColor("yellow");
    } else {
        setIndicatorColor("red");
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckboxChange);
});

//Add event listener -> on input on slider
inputSlider.addEventListener("input", (event) => {
    // console.log(event);
    passwordLength = event.target.value;
    handleSlider();
});

let password;
generateBtn.addEventListener("click", () => {
    //check if no checkbox is selected then do not perform anything
    if (checkboxCheckedCount <= 0) {
        // console.log("Nothing happened");
        return;
    }
    //Special case when all checkbox selected but length of slider is less than checkbox selected
    if (passwordLength < checkboxCheckedCount) {
        passwordLength = checkboxCheckedCount;
        handleSlider();
    }

    //remove old password
    password = "";
    let functionArray = [];

    if (upperCaseCheck.checked) {
        functionArray.push(generateUpperCase);
    }
    if (lowerCaseCheck.checked) {
        functionArray.push(generateLowerCase);
    }
    if (symbolsCheck.checked) {
        functionArray.push(generateSymbol);
    }
    if (numbersCheck.checked) {
        functionArray.push(generateRandomNumber);
    }

    // console.log("Array of Functions = ", functionArray);

    //Make sure all occurrence of functionArray should be added in password
    for (let fn of functionArray) {
        password = password + fn();
    }

    // console.log("After running all checkbox functions = ", password);
    // console.log(passwordLength);
    // console.log(functionArray.length);

    for (let i = 0; i < passwordLength - functionArray.length; i++) {
        let randomIndex = getRandomInteger(0, functionArray.length);
        password = password + functionArray[randomIndex]();
    }
    // console.log("After completing entire length of slider password ----> ");

    //shuffle
    password = shufflePassword(Array.from(password));
    // console.log("After shuffle password: ", password);
    
    passwordDisplay.textContent = password;
    calculateStrength();
});

//Toggle/Change Dark Mode to Light Mode
const lightModeTheme = {
    "--primary": "#00a6a0",
    "--primary-dark": "#007b77",
    "--accent": "#d1007a",
    "--accent-glow": "#ff33b5",
    "--background": "#f8f9fb",
    "--panel-bg": "rgba(255, 255, 255, 0.85)",
    "--text": "#0a0a0f",
    "--weak": "#ff3366",
    "--medium": "#e6a800",
    "--strong": "#00b35a",
};

const darkModeTheme = {
    "--primary": "#00fff0",
    "--primary-dark": "#00ffe1",
    "--accent": "#ff00aa",
    "--accent-glow": "#ff33cc",
    "--background": "#0b0b0f",
    "--panel-bg": "rgba(15, 15, 25, 0.9)",
    "--text": "#ffffff",
    "--weak": "#ff0055",
    "--medium": "#ffae00",
    "--strong": "#00ff77",
};

function applyTheme(themeObject) {
    //object -> key it is similar to :root of our css
    for (let key in themeObject) {
        root.style.setProperty(key, themeObject[key]);
    }
}

//check if user is having dark mode on their system
let isDarkMode = window.matchMedia("prefers-color-scheme: dark").matches;

//if isDrakMode true -> then we will load our page in darkmode
let theme = isDarkMode ? "fa-solid fa-sun" : "fa-solid fa-moon";

iconBtn.addEventListener("click", () => {
    isDarkMode = !isDarkMode;
    applyTheme(isDarkMode ? darkModeTheme : lightModeTheme);
    themeIcon.className = isDarkMode ? "fa-solid fa-sun" : "fa-solid fa-moon";
});

//Logic For copy
function copyContent() {
    if (passwordDisplay.textContent === "Click Generate") {
        return;
    }
    navigator.clipboard.writeText(passwordDisplay.textContent);

    copyBtn.textContent = "Copied";

    setTimeout(() => {
        copyBtn.textContent = "Copy";
    }, 2000);
}

copyBtn.addEventListener("click", ()=>{
    copyContent();
});

