// Initialize variables
let bpm = 60;
let isMetronomeRunning = false;
let metronomeInterval;
let audioContext;
let beepBuffer;

// Load beep sound
async function loadBeepSound() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const response = await fetch('beep.mp3');
    const arrayBuffer = await response.arrayBuffer();
    beepBuffer = await audioContext.decodeAudioData(arrayBuffer);
}

// Play beep sound
function playBeep() {
    const source = audioContext.createBufferSource();
    source.buffer = beepBuffer;
    source.connect(audioContext.destination);
    source.start(0);
}

// Start metronome
function startMetronome() {
    if (isMetronomeRunning) return;
    isMetronomeRunning = true;

    const interval = 60000 / bpm; // Calculate interval in milliseconds
    metronomeInterval = setInterval(() => {
        playBeep();
    }, interval);
}

// Stop metronome
function stopMetronome() {
    clearInterval(metronomeInterval);
    isMetronomeRunning = false;
}

// Adjust BPM via buttons
function adjustBPM(change) {
    bpm += change;
    bpm = Math.max(15, Math.min(300, bpm));
    document.getElementById('bpm-input').value = bpm;
    validateBPM();
}

// Validate BPM and enable/disable OK button
function validateBPM() {
    const bpmInput = document.getElementById('bpm-input');
    const startButton = document.getElementById('start-button');
    bpm = parseInt(bpmInput.value);

    if (bpm < 15 || bpm > 300 || isNaN(bpm)) {
        startButton.disabled = true;
        startButton.style.opacity = '0.5';
    } else {
        startButton.disabled = false;
        startButton.style.opacity = '1';
    }
}

// Start metronome from adjustment page
function startMetronomeFromAdjustPage() {
    if (bpm < 15 || bpm > 300) return;
    document.getElementById('bpm-display').textContent = bpm;

    stopMetronome();
    startMetronome();
    showPage('metronome-page');
}

// Adjust BPM randomly on Tap button
function adjustRandomBPM() {
    stopMetronome();

    // Adjust BPM randomly
    const randomChange = Math.floor(Math.random() * 10) + 1;
    bpm += Math.random() < 0.5 ? -randomChange : randomChange;
    bpm = Math.max(15, Math.min(300, bpm));
    document.getElementById('bpm-display').textContent = bpm;

    // Display greeting if enabled
    const greetingToggle = document.getElementById('greeting-toggle').checked;
    if (greetingToggle) {
        const greetings = ["幹", "操", "你在彈三小", "?", "去你的", "靠邀"];
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        const greetingMessage = document.getElementById('greeting-message');

        // Set the greeting text and reset animation
        greetingMessage.textContent = randomGreeting;
        greetingMessage.style.display = 'block';

        // Reset animation by removing and re-adding the class
        greetingMessage.classList.remove('animate'); // Remove the class
        void greetingMessage.offsetWidth; // Force reflow to reset the animation
        greetingMessage.classList.add('animate'); // Reapply the class

        // Ensure it stays visible for the full animation duration (e.g., 3 seconds)
        setTimeout(() => {
            greetingMessage.style.display = 'none';
            greetingMessage.classList.remove('animate'); // Ensure it's clean for next use
        }, 3000); // Match the animation duration
    }

    startMetronome();
}


// Toggle dark mode and update the icon
function toggleDarkMode() {
    const body = document.body;
    const modeIcon = document.getElementById('mode-icon');

    // Print "hi" to the web to confirm the click works
    const testDiv = document.createElement('div'); // Create a new div
    testDiv.textContent = 'hi'; // Set the text content
    testDiv.style.position = 'absolute'; // Position it on the screen
    testDiv.style.top = '10px'; 
    testDiv.style.right = '10px'; 
    testDiv.style.backgroundColor = 'yellow'; // Make it visible
    testDiv.style.padding = '10px';
    testDiv.style.fontSize = '20px';
    testDiv.style.border = '1px solid black';
    document.body.appendChild(testDiv); // Add it to the body

    // Remove the "hi" message after 2 seconds
    setTimeout(() => {
        document.body.removeChild(testDiv);
    }, 2000);

    // Toggle the dark mode class
    const isDarkMode = body.classList.toggle('dark-mode');

    // Update the icon based on the mode
    modeIcon.textContent = isDarkMode ? '🌙' : '☀️';

    // Save the user's preference in localStorage
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
}



// Load the user's preference on page load
function loadDarkModePreference() {
    const darkModePreference = localStorage.getItem('darkMode');
    const body = document.body;
    const modeIcon = document.getElementById('mode-icon');

    // Apply the dark mode if the preference is saved as "enabled"
    if (darkModePreference === 'enabled') {
        body.classList.add('dark-mode');
        modeIcon.textContent = '🌙';
    } else {
        body.classList.remove('dark-mode');
        modeIcon.textContent = '☀️';
    }
}

// Load preferences as soon as the DOM is ready
document.addEventListener('DOMContentLoaded', loadDarkModePreference);


// Navigate between pages
function showPage(pageId) {
    document.getElementById('bpm-page').style.display = pageId === 'bpm-page' ? 'flex' : 'none';
    document.getElementById('metronome-page').style.display = pageId === 'metronome-page' ? 'flex' : 'none';
}

// Go back to adjustment page
function goBack() {
    stopMetronome();
    showPage('bpm-page');
    document.getElementById('bpm-input').value = bpm;
}

// Initialize page
window.onload = async () => {
    loadDarkModePreference();
    await loadBeepSound();
    validateBPM();
    showPage('bpm-page');
};

// Event listeners
document.getElementById('mode-toggle').addEventListener('click', toggleDarkMode);
document.getElementById('bpm-input').addEventListener('input', validateBPM);
