// Initialize BPM and set up initial state
let bpm = 60;
let isMetronomeRunning = false;
let metronomeTimeout;
const beepFile = 'beep.wav';

// Display initial BPM value in both the input box and display area
document.getElementById('bpm-input').value = bpm;
document.getElementById('bpm-display').textContent = bpm;

// Function to play the metronome sound at the specified BPM
function playMetronome() {
    if (!isMetronomeRunning) return;

    // Create a new Audio object each time to avoid blocking
    const beepSound = new Audio(beepFile);
    beepSound.play();

    // Calculate interval in milliseconds based on BPM
    const interval = 60000 / bpm;

    // Use setTimeout instead of setInterval for better timing precision
    metronomeTimeout = setTimeout(playMetronome, interval);
}

// Start the metronome
function startMetronome() {
    // Start only if it's not already running
    if (!isMetronomeRunning) {
        isMetronomeRunning = true;
        playMetronome();
    }
}

// Stop the metronome immediately
function stopMetronome() {
    isMetronomeRunning = false;
    clearTimeout(metronomeTimeout); // Clear any scheduled sound playbacks
}

// Adjust BPM by pressing the +/- buttons
function adjustBPM(change) {
    stopMetronome(); // Stop the sound immediately

    // Update BPM based on button click
    bpm = parseInt(document.getElementById('bpm-input').value) || bpm;
    bpm += change;
    bpm = Math.min(300, Math.max(15, bpm));
    document.getElementById('bpm-input').value = bpm;
    validateBPM();

    startMetronome(); // Restart metronome with updated BPM
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

// Start metronome from BPM adjustment page and navigate to metronome page
function startMetronomeFromAdjustPage() {
    bpm = parseInt(document.getElementById('bpm-input').value) || bpm;
    document.getElementById('bpm-display').textContent = bpm;

    stopMetronome(); // Ensure metronome is stopped before starting

    startMetronome(); // Start metronome with current BPM
    showPage('metronome-page');
}

// Adjust BPM randomly on the touch area click (1-10 units)
function adjustRandomBPM() {
    stopMetronome(); // Stop metronome before adjusting BPM

    // Randomly increase or decrease BPM by 1-10 units
    let randomChange = Math.floor(Math.random() * 10) + 1;
    bpm += Math.random() < 0.5 ? -randomChange : randomChange;
    bpm = Math.min(300, Math.max(15, bpm)); // Clamp between 15 and 300

    document.getElementById('bpm-display').textContent = bpm;

    startMetronome(); // Restart metronome with updated BPM
}

// Go back to the BPM adjustment page and stop metronome
function goBack() {
    stopMetronome(); // Stop the metronome immediately
    showPage('bpm-page');
    document.getElementById('bpm-input').value = bpm; // Display current BPM in input
}

// Function to show the specified page and hide the other
function showPage(pageId) {
    document.getElementById('bpm-page').style.display = pageId === 'bpm-page' ? 'flex' : 'none';
    document.getElementById('metronome-page').style.display = pageId === 'metronome-page' ? 'flex' : 'none';
}

// Ensure consistent BPM validation on page load
window.onload = () => {
    showPage('bpm-page');
    validateBPM();
};

// Event listener for validating BPM
document.getElementById('bpm-input').addEventListener('input', validateBPM);

// Event listener for starting the metronome from the adjustment page
document.getElementById('start-button').addEventListener('click', startMetronomeFromAdjustPage);

// Event listener for stopping the metronome when going back
document.getElementById('back-button').addEventListener('click', goBack);
