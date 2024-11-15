// Initialize variables for AudioContext, BPM, and Dark Mode
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

// Real-time BPM validation and OK button enable/disable
function validateBPM() {
    const input = document.getElementById('bpm-input');
    const startButton = document.getElementById('start-button');
    bpm = parseInt(input.value) || bpm;

    if (bpm < 15 || bpm > 300) {
        startButton.disabled = true;
        startButton.style.opacity = "0.5"; // Grey out the button
    } else {
        startButton.disabled = false;
        startButton.style.opacity = "1"; // Restore normal appearance
    }
}

// Start metronome from BPM adjustment page and navigate to metronome page
function startMetronomeFromAdjustPage() {
    bpm = parseInt(document.getElementById('bpm-input').value) || bpm;
    if (bpm < 15 || bpm > 300) return; // Do nothing if BPM is out of range
    document.getElementById('bpm-display').textContent = bpm;

    stopMetronome(); // Ensure metronome is stopped before starting
    startMetronome(); // Start with current BPM
    showPage('metronome-page');
}

// Function to play the metronome sound at the specified BPM
function playMetronome() { /* Existing metronome code */ }
function stopMetronome() { /* Existing metronome code */ }

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

// Navigation to BPM adjustment page with metronome stop
function goBack() {
    stopMetronome(); // Stop immediately
    showPage('bpm-page');
    document.getElementById('bpm-input').value = bpm; // Display current BPM in input
}

// Show specified page and hide others
function showPage(pageId) {
    document.getElementById('bpm-page').style.display = pageId === 'bpm-page' ? 'flex' : 'none';
    document.getElementById('metronome-page').style.display = pageId === 'metronome-page' ? 'flex' : 'none';
}

// Initial setup on page load
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
