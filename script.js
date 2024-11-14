// Initialize BPM and set up initial state
let bpm = 60;
let isMetronomeRunning = false;
let metronomeTimeout;
const beepFile = 'beep.mp3';

// Display initial BPM value in both the input box and display area
document.getElementById('bpm-input').value = bpm;
document.getElementById('bpm-display').textContent = bpm;

// Function to play the metronome sound at the specified BPM
function playMetronome() {
    if (!isMetronomeRunning) return;

    // Create a new Audio object each time to avoid blocking
    const beepSound = new Audio(beepFile);
    beepSound.play();

    // Calculate the interval in milliseconds based on BPM
    const interval = 60000 / bpm;

    // Use setTimeout instead of setInterval for better timing precision
    metronomeTimeout = setTimeout(playMetronome, interval);
}

// Start metronome and navigate to the touch interaction page
function startMetronome() {
    bpm = parseInt(document.getElementById('bpm-input').value) || bpm;
    document.getElementById('bpm-display').textContent = bpm;

    // Start the metronome only if it's not already running
    if (!isMetronomeRunning) {
        isMetronomeRunning = true;
        playMetronome();
    }

    showPage('metronome-page');
}

// Stop the metronome
function stopMetronome() {
    isMetronomeRunning = false;
    clearTimeout(metronomeTimeout); // Clear the timeout to stop the sound
}

// Adjust BPM by pressing the +/- buttons
function adjustBPM(change) {
    bpm = parseInt(document.getElementById('bpm-input').value) || bpm;
    bpm += change;
    bpm = Math.min(300, Math.max(15, bpm));
    document.getElementById('bpm-input').value = bpm;
    validateBPM();

    // Update interval if the metronome is running
    if (isMetronomeRunning) {
        stopMetronome();
        startMetronome();
    }
}

// Validate BPM input in real-time and toggle OK button
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

// Adjust BPM randomly on the touch area click (1-10 units)
function adjustRandomBPM() {
    let randomChange = Math.floor(Math.random() * 10) + 1;
    bpm += Math.random() < 0.5 ? -randomChange : randomChange;
    bpm = Math.min(300, Math.max(15, bpm)); // Clamp between 15 and 300
    document.getElementById('bpm-display').textContent = bpm;

    // Update interval if the metronome is running
    if (isMetronomeRunning) {
        stopMetronome();
        startMetronome();
    }
}

// Ensure consistent BPM validation on page load
window.onload = () => {
    showPage('bpm-page');
    validateBPM();
};

// Event listener for validating BPM
document.getElementById('bpm-input').addEventListener('input', validateBPM);

// Event listener for stopping the metronome when going back
document.getElementById('back-button').addEventListener('click', () => {
    stopMetronome();
    goBack();
});

// Function to show the specified page and hide the other
function showPage(pageId) {
    document.getElementById('bpm-page').style.display = pageId === 'bpm-page' ? 'flex' : 'none';
    document.getElementById('metronome-page').style.display = pageId === 'metronome-page' ? 'flex' : 'none';
}
