/**
 * Point culture (en Français car je suis un peu obligé): 
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces. 
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 * 
 * Sur ce... Amusez-vous bien ! 
 */
let startTime = null;
let currentWordIndex = 0;
const wordsToType = [];
let correctChars = 0;
let totalChars = 0;

const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");
const wordCountDisplay = document.getElementById("word-count");

const words = {
    easy: ["apple", "banana", "grape", "orange", "cherry"],
    medium: ["keyboard", "monitor", "printer", "charger", "battery"],
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception","cyclopentanoperhydrophénanthrène"]
};

// Generate a random word from the selected mode
const getRandomWord = (mode) => {
    const wordList = words[mode];
    return wordList[Math.floor(Math.random() * wordList.length)];
};

// Initialize the typing test
const startTest = (wordCount = 30) => {
    wordsToType.length = 0; // Clear previous words
    wordDisplay.innerHTML = ""; // Clear display
    currentWordIndex = 0;
    startTime = null;
    correctChars = 0;
    totalChars = 0;
    wordCountDisplay.textContent = "0";

    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(modeSelect.value));
    }

    wordsToType.forEach((word, index) => {
        const span = document.createElement("span");
        span.textContent = word + " ";
        if (index === 0) span.style.color = " #ffa600"; // Highlight first word
        wordDisplay.appendChild(span);
    });

    inputField.value = "";
    updateResults();
};

// Start the timer when user begins typing
const startTimer = () => {
    if (!startTime) startTime = Date.now();
};

// Calculate and return WPM & accuracy
const getCurrentStats = () => {
    if (!startTime) return { wpm: 0, accuracy: 0 };
    
    const elapsedMinutes = (Date.now() - startTime) / 60000;
    const wpm = totalChars > 0 ? (correctChars / 5) / elapsedMinutes : 0;
    const accuracy = totalChars > 0 ? (correctChars / totalChars) * 100 : 0;

    return { 
        wpm: Math.max(0, wpm.toFixed(2)), 
        accuracy: Math.min(100, accuracy.toFixed(2))
    };
};

// Update results display
const updateResults = () => {
    const { wpm, accuracy } = getCurrentStats();
    document.querySelector(".wpm-value").textContent = wpm;
    document.querySelector(".accuracy-value").textContent = accuracy + "%";
    wordCountDisplay.textContent = currentWordIndex;
};

// Check character by character
const checkInput = () => {
    const currentWord = wordsToType[currentWordIndex];
    const inputValue = inputField.value;
    let newCorrectChars = 0;
    
    for (let i = 0; i < inputValue.length; i++) {
        if (i < currentWord.length && inputValue[i] === currentWord[i]) {
            newCorrectChars++;
        }
    }
    
    correctChars = (currentWordIndex * currentWord.length) + newCorrectChars;
    totalChars = (currentWordIndex * currentWord.length) + inputValue.length;
    updateResults();
};

// Move to the next word and update stats only on spacebar press 
const updateWord = (event) => {
    if (event.key === " ") {
        const currentWord = wordsToType[currentWordIndex];
        if (inputField.value.trim() === currentWord) {
            correctChars += currentWord.length;
            totalChars += currentWord.length;
            
            currentWordIndex++;
            highlightNextWord();
            inputField.value = "";
            updateResults();
            
            event.preventDefault();
        }
    }
};

// Highlight the current word
const highlightNextWord = () => {
    const wordElements = wordDisplay.children;

    if (currentWordIndex < wordElements.length) {
        if (currentWordIndex > 0) {
            wordElements[currentWordIndex - 1].style.color = "  #00de3f";
        }
        wordElements[currentWordIndex].style.color = " #ffa600";
    } else {
        // Test completed
        wordElements[currentWordIndex - 1].style.color = " #00de3f";
    }
};

// Event listeners
inputField.addEventListener("input", () => {
    startTimer();
    checkInput();
});

inputField.addEventListener("keydown", (event) => {
    if (event.key === " ") {
        updateWord(event);
    }
});

modeSelect.addEventListener("change", () => startTest());
document.getElementById("restart-btn").addEventListener("click", () => startTest());


// Start the test
startTest();