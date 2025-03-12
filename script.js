// Initialize variables for AudioContext, BPM, and Metronome
let bpm = 60;
let isMetronomeRunning = false;
let audioContext;
let beepBuffer; // Stores the audio buffer for the beep sound
let nextBeepTime = 0; // When the next beep should play
let beepInterval;
const lookahead = 25.0; // Scheduler lookahead in milliseconds
const scheduleAheadTime = 0.1; // How far ahead to schedule audio in seconds

// Load the beep sound file as an Audio Buffer
async function loadBeepSound() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const response = await fetch('beep.mp3');
    const arrayBuffer = await response.arrayBuffer();
    beepBuffer = await audioContext.decodeAudioData(arrayBuffer);
}

// Start playing the metronome
function startMetronome() {
    if (isMetronomeRunning) return; // Prevent double starting
    isMetronomeRunning = true;

    // Calculate interval in seconds based on BPM
    beepInterval = 60.0 / bpm;
    nextBeepTime = audioContext.currentTime;

    scheduler(); // Begin the scheduling loop
}

// Stop the metronome
function stopMetronome() {
    isMetronomeRunning = false;
    clearTimeout(schedulerTimer); // Stop the scheduler loop
}

// Scheduler to manage precise audio timing
let schedulerTimer;
function scheduler() {
    if (!isMetronomeRunning) return;

    // Schedule beep sounds ahead of time
    while (nextBeepTime < audioContext.currentTime + scheduleAheadTime) {
        scheduleBeep(nextBeepTime); // Schedule the beep sound
        nextBeepTime += beepInterval; // Increment for the next beep
    }

    // Set up the next scheduler call
    schedulerTimer = setTimeout(scheduler, lookahead);
}

// Function to schedule a beep at a specified time
function scheduleBeep(time) {
    const source = audioContext.createBufferSource();
    source.buffer = beepBuffer;
    source.connect(audioContext.destination);
    source.start(time);
}

// Function to adjust BPM and restart the metronome
function adjustBPM(change) {
    const bpmInput = document.getElementById('bpm-input');
    let currentBPM = parseInt(bpmInput.value) || bpm;
    currentBPM += change;
    currentBPM = Math.max(15, Math.min(300, currentBPM)); // Clamp BPM between 15 and 300
    bpmInput.value = currentBPM;
    bpm = currentBPM;  // Update the global bpm variable

    validateBPM();

    // If the metronome is running, restart it with the new BPM
    if (isMetronomeRunning) {
        stopMetronome();
        startMetronome();
    }

    // Also update the displayed BPM (if there's a display for it)
    const bpmDisplay = document.getElementById('bpm-display');
    if (bpmDisplay) {
        bpmDisplay.textContent = bpm;
    }
}


// Real-time BPM validation and OK button enable/disable
function validateBPM() {
    const input = document.getElementById('bpm-input');
    const startButton = document.getElementById('start-button');

    bpm = parseInt(input.value) || bpm;

    // Disable the OK button if BPM is out of range
    if (bpm < 15 || bpm > 300) {
        startButton.disabled = true;
        startButton.style.opacity = "0.5"; // Grey out the button
    } else {
        startButton.disabled = false;
        startButton.style.opacity = "1"; // Restore normal appearance
    }
}

// Function for starting metronome from the adjustment page
function startMetronomeFromAdjustPage() {
    bpm = parseInt(document.getElementById('bpm-input').value) || bpm;
    document.getElementById('bpm-display').textContent = bpm;
    
    stopMetronome(); // Ensure metronome is stopped before starting
    startMetronome(); // Start with current BPM
    showPage('metronome-page');
}

// Random BPM adjustment on the touch area click (1-10 units)
function adjustRandomBPM() {
    stopMetronome(); // Stop immediately

    let randomChange = Math.floor(Math.random() * 10) + 1;
    bpm += Math.random() < 0.5 ? -randomChange : randomChange;
    bpm = Math.min(300, Math.max(15, bpm));

    document.getElementById('bpm-display').textContent = bpm;
    startMetronome(); // Restart with new BPM
}

function greetings() {
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
}

// Navigation to BPM adjustment page with metronome stop
function goBack() {
    stopMetronome(); // Stop immediately
    showPage('bpm-page');
    document.getElementById('bpm-input').value = bpm; // Display current BPM in input
}

function toggleDarkMode() {
    const body = document.body;
    const modeToggle = document.getElementById('mode-toggle');

    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        modeToggle.textContent = '🌞'; // Sun emoji for light mode
        localStorage.setItem('darkMode', 'disabled');
    } else {
        body.classList.add('dark-mode');
        modeToggle.textContent = '🌜'; // Moon emoji for dark mode
        localStorage.setItem('darkMode', 'enabled');
    }
}

// Ensure this is called when the document is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const modeToggle = document.getElementById('mode-toggle');
    modeToggle.addEventListener('click', toggleDarkMode);
    loadDarkModePreference(); // Call this here to set the correct initial state

    // Add keyboard event listeners
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            adjustBPM(-1); 
        } else if (event.key === 'ArrowRight') {
            adjustBPM(1); 
        } else if (event.key === ' ') { 
            event.preventDefault();
            if (isMetronomeRunning) {
                stopMetronome();
            } else {
                startMetronome();
            }
        }
    });
});



function loadDarkModePreference() {
    const darkMode = localStorage.getItem('darkMode');
    const button = document.getElementById('mode-toggle');

    if (darkMode === 'enabled') {
        document.body.classList.add('dark-mode');
        button.textContent = '🌜';  // Moon for dark mode
    } else {
        document.body.classList.remove('dark-mode');
        button.textContent = '🌞';  // Sun for light mode
    }
}

window.onload = () => {
    loadDarkModePreference();
};


// Show specified page and hide others
function showPage(pageId) {
    document.getElementById('bpm-page').style.display = pageId === 'bpm-page' ? 'flex' : 'none';
    document.getElementById('metronome-page').style.display = pageId === 'metronome-page' ? 'flex' : 'none';
    document.getElementById('mode-toggle').addEventListener('change', toggleDarkMode);
}

// Initial setup on page load
window.onload = async () => {
    showPage('bpm-page');
    await loadBeepSound(); // Load beep sound for the AudioContext
    validateBPM();
    loadDarkModePreference(); // Load dark mode preference on page load
};

// BPM input validation and metronome start from adjustment page
document.getElementById('bpm-input').addEventListener('input', validateBPM);
document.getElementById('start-button').addEventListener('click', startMetronomeFromAdjustPage);
document.getElementById('back-button').addEventListener('click', goBack);
