// Initialize BPM and state variables
let bpm = 60;
let isMetronomeRunning = false;
let curTime = 0.0;
let noteCount = 0;
let timerId;

// Set up AudioContext
window.AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext();
const accentPitch = 380; // Frequency in Hz for the primary beat
const offBeatPitch = 200; // Frequency in Hz for secondary beat

// Display initial BPM in both input box and display area
document.getElementById('bpm-input').value = bpm;
document.getElementById('bpm-display').textContent = bpm;

// Function to start the metronome
function startMetronome() {
    bpm = parseInt(document.getElementById('bpm-input').value) || bpm;
    document.getElementById('bpm-display').textContent = bpm;

    // Clear any previous timer and initialize time
    stopMetronome();
    curTime = context.currentTime;
    noteCount = 0;
    isMetronomeRunning = true;

    // Start the scheduling loop
    schedule();
    showPage('metronome-page');
}

// Function to stop the metronome
function stopMetronome() {
    if (timerId) {
        cancelAnimationFrame(timerId);
    }
    isMetronomeRunning = false;
}

// Function to schedule the metronome notes
function schedule() {
    if (!isMetronomeRunning) return; // Stop if metronome is not running

    while (curTime < context.currentTime + 0.1) { // Look-ahead window of 0.1 seconds
        playNoteAt(curTime); // Schedule the beep sound
        updateTime(); // Update time for the next beep
    }

    // Use requestAnimationFrame to continue the loop
    timerId = requestAnimationFrame(schedule);
}

// Function to play a note at the specified time
function playNoteAt(t) {
    const note = context.createOscillator();
    const gainNode = context.createGain();

    // Set frequency for the beat (accent or off-beat)
    note.frequency.value = noteCount === 0 ? accentPitch : offBeatPitch;

    // Set duration of the note
    note.connect(gainNode);
    gainNode.connect(context.destination);
    gainNode.gain.setValueAtTime(0.1, t); // Set the volume
    note.start(t);
    note.stop(t + 0.05); // 50 ms duration
}

// Function to update the time for each metronome tick
function updateTime() {
    const interval = 60.0 / bpm;
    curTime += interval;
    noteCount = (noteCount + 1) % 4; // Adjust this if time signature changes
}

// Adjust BPM by pressing the +/- buttons
function adjustBPM(change) {
    bpm = parseInt(document.getElementById('bpm-input').value) || bpm;
    bpm += change;
    bpm = Math.min(300, Math.max(15, bpm));
    document.getElementById('bpm-input').value = bpm;
    validateBPM();

    // If metronome is running, update scheduling with new BPM
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

    // If metronome is running, update scheduling with new BPM
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
