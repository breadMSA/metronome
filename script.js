// Initialize BPM and load from localStorage if available
let bpm = parseInt(localStorage.getItem('bpm')) || 60;

// Display the BPM in the input and display areas
document.getElementById('bpm-input').value = bpm;
document.getElementById('bpm-display').textContent = bpm;

// Adjust BPM on clicking plus/minus buttons
function adjustBPM(change) {
    bpm = parseInt(document.getElementById('bpm-input').value);
    bpm += change;
    document.getElementById('bpm-input').value = bpm;
}

// Validate BPM on blur (when user finishes typing)
function validateBPMOnBlur() {
    bpm = parseInt(document.getElementById('bpm-input').value);
    if (bpm < 15) bpm = 15;
    if (bpm > 300) bpm = 300;
    document.getElementById('bpm-input').value = bpm;
}

// Start metronome and navigate to the touch interaction page
function startMetronome() {
    bpm = parseInt(document.getElementById('bpm-input').value);
    if (bpm < 15 || bpm > 300) {
        document.getElementById('hint-message').style.display = "block";
        return;
    } else {
        document.getElementById('hint-message').style.display = "none";
    }
    localStorage.setItem('bpm', bpm);
    localStorage.setItem('started', 'true');
    showPage('metronome-page');
    document.getElementById('bpm-display').textContent = bpm;
}

// Navigate back to BPM adjustment page
function goBack() {
    showPage('bpm-page');
    document.getElementById('bpm-input').value = bpm; // Set latest BPM in input box
}

// Show selected page and hide the other
function showPage(pageId) {
    document.getElementById('bpm-page').style.display = pageId === 'bpm-page' ? 'flex' : 'none';
    document.getElementById('metronome-page').style.display = pageId === 'metronome-page' ? 'flex' : 'none';
}

// Adjust BPM randomly on touch area click
function adjustRandomBPM() {
    let randomChange = Math.floor(Math.random() * 10) + 1;
    bpm += Math.random() < 0.5 ? -randomChange : randomChange;
    bpm = Math.min(300, Math.max(15, bpm));
    document.getElementById('bpm-display').textContent = bpm;
    localStorage.setItem('bpm', bpm); // Save latest BPM
}

// On page load, check if the user previously started the metronome
window.onload = () => {
    if (localStorage.getItem('started') === 'true') {
        bpm = parseInt(localStorage.getItem('bpm')) || 60;
        showPage('metronome-page');
        document.getElementById('bpm-display').textContent = bpm;
    } else {
        showPage('bpm-page');
    }
};
