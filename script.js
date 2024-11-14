// Initialize BPM to a default of 60
let bpm = 60;

// Display initial BPM value in both the input box and display area
document.getElementById('bpm-input').value = bpm;
document.getElementById('bpm-display').textContent = bpm;

// Adjust BPM by pressing the +/- buttons
function adjustBPM(change) {
    bpm = parseInt(document.getElementById('bpm-input').value) || bpm;
    bpm += change;
    bpm = Math.min(300, Math.max(15, bpm));
    document.getElementById('bpm-input').value = bpm;
    validateBPM(); // Check BPM validity
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

// Start metronome and navigate to the touch interaction page
function startMetronome() {
    bpm = parseInt(document.getElementById('bpm-input').value) || bpm;
    document.getElementById('bpm-display').textContent = bpm;
    showPage('metronome-page');
}

// Navigate back to BPM adjustment page
function goBack() {
    showPage('bpm-page');
    document.getElementById('bpm-input').value = bpm; // Set the input to the current BPM
}

// Show the specified page and hide the other
function showPage(pageId) {
    document.getElementById('bpm-page').style.display = pageId === 'bpm-page' ? 'flex' : 'none';
    document.getElementById('metronome-page').style.display = pageId === 'metronome-page' ? 'flex' : 'none';
}

// Adjust BPM randomly on the touch area click (1-10 units)
function adjustRandomBPM() {
    let randomChange = Math.floor(Math.random() * 10) + 1;
    bpm += Math.random() < 0.5 ? -randomChange : randomChange;
    bpm = Math.min(300, Math.max(15, bpm)); // Clamp between 15 and 300
    document.getElementById('bpm-display').textContent = bpm;
}

// Ensure consistent BPM validation on page load
window.onload = () => {
    showPage('bpm-page');
    validateBPM(); // Initial validation to set button state correctly
};

// Add an event listener to validate BPM on input change
document.getElementById('bpm-input').addEventListener('input', validateBPM);
