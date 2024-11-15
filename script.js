// Initialize variables
let bpm = 60;
let isMetronomeRunning = false;
let audioContext;
let beepBuffer;

// Load beep sound file
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

// Start the metronome from BPM adjustment page
function startMetronomeFromAdjustPage() {
    bpm = parseInt(document.getElementById('bpm-input').value) || bpm;
    document.getElementById('bpm-display').textContent = bpm;

    stopMetronome(); // Ensure metronome is stopped before starting
    startMetronome(); // Start metronome with current BPM
    showPage('metronome-page'); // Navigate to metronome page
}

// Toggle greeting display based on checkbox
function toggleGreeting() {
    const greetingMessage = document.getElementById('greeting-message');
    greetingMessage.style.display = 'none'; // Hide initially
}

// Random greeting messages for appearance addition
const greetings = ["嗨", "你好", "早上好", "fork use", "?"];
function displayRandomGreeting() {
    const greetingEnabled = document.getElementById('greeting-toggle').checked;
    if (!greetingEnabled) return;

    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    const greetingMessage = document.getElementById('greeting-message');
    greetingMessage.textContent = randomGreeting;
    greetingMessage.style.display = 'block';
}

// Adjust BPM through touch area, show greeting if enabled
function adjustRandomBPM() {
    stopMetronome();
    let randomChange = Math.floor(Math.random() * 10) + 1;
    bpm += Math.random() < 0.5 ? -randomChange : randomChange;
    bpm = Math.min(300, Math.max(15, bpm));
    document.getElementById('bpm-display').textContent = bpm;
    displayRandomGreeting();
    startMetronome();
}

// Ensure consistent BPM validation on page load
window.onload = async () => {
    showPage('bpm-page');
    await loadBeepSound();
    loadDarkModePreference(); // Load stored dark mode preference
    validateBPM();
};

// Show specified page and hide the other
function showPage(pageId) {
    document.getElementById('bpm-page').style.display = pageId === 'bpm-page' ? 'flex' : 'none';
    document.getElementById('metronome-page').style.display = pageId === 'metronome-page' ? 'flex' : 'none';
}

// Event listeners
document.getElementById('mode-toggle').addEventListener('click', toggleDarkMode);
document.getElementById('greeting-toggle').addEventListener('click', toggleGreeting);
document.getElementById('bpm-input').addEventListener('input', validateBPM);
document.getElementById('start-button').addEventListener('click', startMetronomeFromAdjustPage);
document.getElementById('back-button').addEventListener('click', goBack);
