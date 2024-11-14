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
}

// Validate BPM on input blur, clamping it between 15 and 300
function validateBPMOnBlur() {
    let input = document.getElementById('bpm-input');
    bpm = parseInt(input.value) || bpm;
    if (bpm < 15) bpm = 15;
    if (bpm > 300) bpm = 300;
    input.value = bpm;
}

// Start metronome and navigate to the touch interaction page
function startMetronome() {
    bpm = parseInt(document.getElementById('bpm-input').value) || bpm;
    if (bpm < 15 || bpm > 300) {
        document.getElementById('hint-message').style.display = "block";
        return;
    }
    document.getElementById('hint-message').style.display = "none";
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

// Ensure only page refresh retains state without persistent storage
window.onload = () => {
    showPage('bpm-page');
};
