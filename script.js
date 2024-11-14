// Initialize BPM and state variables
let bpm = 60;
let timer;
let noteCount = 0;
let isMetronomeRunning = false;
let curTime = 0.0;

// Set up AudioContext
window.AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext();
const accentPitch = 380; // Frequency in Hz for the primary beat
const offBeatPitch = 200; // Frequency in Hz for secondary beat

// Display initial BPM in both input box and display area
document.getElementById('bpm-input').value = bpm;
document.getElementById('bpm-display').textContent = bpm;

// Function to play the metronome sound at the specified time
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

    // Update UI dot animation or any other indicators if needed
}

// Function to update the time for each metronome tick
function updateTime() {
    const interval = 60.0 / bpm;
    curTime += interval;
    noteCount = (noteCount + 1) % 4; // Adjust this if time signature changes
}

// Function to start the metronome
function startMetronome() {
    bpm = parseInt(document.getElementById('bpm-input').value) || bpm;
    document.getElementById('bpm-display').textContent = bpm;

    // Ensure there are no overlapping intervals
    stopMetronome();

    // Set the initial metronome time and schedule the notes
    curTime = context.currentTime;
    noteCount = 0;
    isMetronomeRunning = true;
    schedule();

    // Switch to metronome page
    showPage('metronome-page');
}

// Function to stop the metronome
function stopMetronome() {
    clearTimeout(timer);
    isMetronomeRunning = false;
}

// Function to schedule the metronome notes
function schedule() {
    while (curTime < context.currentTime + 0.1) { // Look-ahead window of 0.1 seconds
        playNoteAt(curTime); // Schedule the beep sound
        updateTime(); // Update time for the next beep
    }

    // Set a timeout to keep scheduling in small intervals
    timer = setTimeout(schedule, 50);
}

// Adjust BPM by pressing the +/- buttons and restart the metronome
function adjustBPM(change) {
    stopMetronome(); // Stop metronome first to allow smooth adjustment
    bpm = parseInt(document.getElementById('bpm-input').value) || bpm;
    bpm += change;
    bpm = Math.min(300, Math.max(15, bpm));
    document.getElementById('bpm-input').value = bpm;
    validateBPM();

    startMetronome(); // Restart metronome with the new BPM
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

// Adjust BPM randomly on the touch area click, stop and restart metronome
function adjustRandomBPM() {
    stopMetronome(); // Stop the metronome immediately before adjustment

    let randomChange = Math.floor(Math.random() * 10) + 1;
    bpm += Math.random() < 0.5 ? -randomChange : randomChange;
    bpm = Math.min(300, Math.max(15, bpm)); // Clamp between 15 and 300
    document.getElementById('bpm-display').textContent = bpm;

    startMetronome(); // Restart metronome with the new BPM
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
