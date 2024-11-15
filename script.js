// Initialize variables for mode and appearance addition
let bpm = 60;
let isMetronomeRunning = false;
let audioContext;
let beepBuffer;
let nextBeepTime = 0;
let beepInterval;
const lookahead = 25.0;
const scheduleAheadTime = 0.1;

// Load the beep sound file and initialize AudioContext
async function loadBeepSound() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const response = await fetch('beep.mp3');
    const arrayBuffer = await response.arrayBuffer();
    beepBuffer = await audioContext.decodeAudioData(arrayBuffer);
}

// Toggle Dark Mode and save preference in localStorage
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
}

// Load Dark Mode preference on page load
function loadDarkModePreference() {
    const darkModePreference = localStorage.getItem('darkMode');
    if (darkModePreference === 'enabled') {
        document.body.classList.add('dark-mode');
        document.getElementById('mode-toggle').checked = true;
    }
}

// Random Greeting Display
const greetings = ["嗨", "你好", "早上好", "fork use", "?"];
function displayRandomGreeting() {
    const greetingEnabled = document.getElementById('greeting-toggle').checked;
    if (!greetingEnabled) return;

    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    const greetingMessage = document.getElementById('greeting-message');
    greetingMessage.textContent = randomGreeting;
    greetingMessage.style.display = 'block';
}

// Toggle Greeting Display based on user preference
function toggleGreeting() {
    const greetingMessage = document.getElementById('greeting-message');
    greetingMessage.style.display = 'none'; // Hide initially
}

// Start and stop the metronome with AudioContext scheduling
function startMetronome() { /* Existing metronome code */ }
function stopMetronome() { /* Existing metronome code */ }

// Adjust BPM and restart the metronome
function adjustBPM(change) {
    stopMetronome();
    bpm = parseInt(document.getElementById('bpm-input').value) || bpm;
    bpm += change;
    bpm = Math.min(300, Math.max(15, bpm));
    document.getElementById('bpm-input').value = bpm;
    validateBPM();
    startMetronome();
}

// BPM adjustment through the touch area, showing greeting if enabled
function adjustRandomBPM() {
    stopMetronome();
    let randomChange = Math.floor(Math.random() * 10) + 1;
    bpm += Math.random() < 0.5 ? -randomChange : randomChange;
    bpm = Math.min(300, Math.max(15, bpm));
    document.getElementById('bpm-display').textContent = bpm;
    displayRandomGreeting(); // Show greeting message if enabled
    startMetronome();
}

// Initialize the application on page load
window.onload = async () => {
    showPage('bpm-page');
    await loadBeepSound();
    loadDarkModePreference();
    validateBPM();
};

// Event listeners for Dark Mode, Greeting Toggle, and BPM adjustment
document.getElementById('mode-toggle').addEventListener('click', toggleDarkMode);
document.getElementById('greeting-toggle').addEventListener('click', toggleGreeting);
document.getElementById('bpm-input').addEventListener('input', validateBPM);
document.getElementById('start-button').addEventListener('click', startMetronomeFromAdjustPage);
document.getElementById('back-button').addEventListener('click', goBack);
