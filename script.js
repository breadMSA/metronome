// Initialize default BPM
let bpm = 60;

// Display the BPM on page load or retrieval
document.getElementById('bpm-input').value = bpm;
document.getElementById('bpm-display').textContent = bpm;

// Adjust BPM based on button click or direct input
function adjustBPM(change) {
    bpm = Math.min(300, Math.max(15, bpm + change));
    document.getElementById('bpm-input').value = bpm;
}

function validateBPM() {
    let input = document.getElementById('bpm-input');
    bpm = parseInt(input.value);
    if (bpm < 15) bpm = 15;
    if (bpm > 300) bpm = 300;
    input.value = bpm;
}

// Navigate to Metronome Page and store BPM in session
function startMetronome() {
    sessionStorage.setItem('bpm', bpm);
    sessionStorage.setItem('started', 'true');
    showPage('metronome-page');
    document.getElementById('bpm-display').textContent = bpm;
}

// Go back to BPM adjustment page
function goBack() {
    showPage('bpm-page');
}

// Show selected page and hide the other
function showPage(pageId) {
    document.getElementById('bpm-page').style.display = pageId === 'bpm-page' ? 'flex' : 'none';
    document.getElementById('metronome-page').style.display = pageId === 'metronome-page' ? 'flex' : 'none';
}

// Adjust BPM by a random value (1-10) on touch area tap
function adjustRandomBPM() {
    let randomChange = Math.floor(Math.random() * 10) + 1;
    bpm += Math.random() < 0.5 ? -randomChange : randomChange;
    bpm = Math.min(300, Math.max(15, bpm));
    document.getElementById('bpm-display').textContent = bpm;
}

// On page load, check if sessionStorage indicates the user started the metronome
window.onload = () => {
    if (sessionStorage.getItem('started') === 'true') {
        bpm = parseInt(sessionStorage.getItem('bpm')) || 60;
        showPage('metronome-page');
        document.getElementById('bpm-display').textContent = bpm;
    } else {
        showPage('bpm-page');
    }
};
