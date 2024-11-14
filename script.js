// Initialize BPM and state variables
let bpm = 60;
let metronomeInterval;
let isMetronomeRunning = false;
const beepFile = 'beep.mp3';

// Display initial BPM value in both the input box and display area
document.getElementById('bpm-input').value = bpm;
document.getElementById('bpm-display').textContent = bpm;

// Create a new audio object each time and play the sound
function playBeepSound() {
    const beepSound = new Audio(beepFile);
    beepSound.play().catch(error => {
        console.log("Error playing beep sound:", error);
    });
}

// Function to start the metronome
function startMetronome() {
    bpm = parseInt(document.getElementById('bpm-input').value) || bpm;
    document.getElementById('bpm-display').textContent = bpm;
    
    // Calculate interval in milliseconds based on BPM
    const interval = 60000 / bpm;

    // Stop any existing interval to avoid overlaps
    stopMetronome();

    // Start a new interval to play the beep sound
    metronomeInterval = setInterval(() => {
        playBeepSound();
    }, interval);

    isMetronomeRunning = true;
    showPage('metronome-page');
}

// Function to stop the metronome
function stopMetronome() {
    clearInterval(metronomeInterval);
    isMetronomeRunning = false;
}

// Adjust BPM by pressing the +/- buttons
function adjustBPM(change) {
    bpm = parseInt(document.getElementById('bpm-input').value) || bpm;
    bpm += change;
    bpm = Math.min(300, Math.max(15, bpm));
    document.getElementById('bpm-input').value = bpm;
    validateBPM();

    // If metronome is running, update interval with new BPM
    if (isMetronomeRunning) {
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

    // If metronome is running, update interval with new BPM
    if (isMetronomeRunning) {
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
