// Initialize variables for dark mode and BPM
let bpm = 60;

// Toggle Dark Mode and Save Preference
function toggleDarkMode() {
    const body = document.body;
    const darkModeEnabled = document.getElementById('mode-toggle').checked;

    if (darkModeEnabled) {
        body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
    }
}

// Load Dark Mode Preference on Page Load
function loadDarkModePreference() {
    const darkModeSetting = localStorage.getItem('darkMode');
    const modeToggle = document.getElementById('mode-toggle');

    if (darkModeSetting === 'enabled') {
        document.body.classList.add('dark-mode');
        modeToggle.checked = true;
    } else {
        document.body.classList.remove('dark-mode');
        modeToggle.checked = false;
    }
}

// Validate BPM and Enable/Disable OK Button
function validateBPM() {
    const bpmInput = document.getElementById('bpm-input');
    const startButton = document.getElementById('start-button');

    bpm = parseInt(bpmInput.value);

    if (bpm < 15 || bpm > 300 || isNaN(bpm)) {
        startButton.disabled = true;
        startButton.style.opacity = '0.5';
    } else {
        startButton.disabled = false;
        startButton.style.opacity = '1';
    }
}

// Start Metronome and Navigate to the Adjust BPM Page
function startMetronomeFromAdjustPage() {
    if (bpm < 15 || bpm > 300) return; // Ensure BPM is valid

    document.getElementById('bpm-display').textContent = bpm;
    showPage('metronome-page');
}

// Navigate Back to the BPM Adjustment Page
function goBack() {
    showPage('bpm-page');
    document.getElementById('bpm-input').value = bpm;
}

// Adjust BPM Randomly on the Tap Button
function adjustRandomBPM() {
    let randomChange = Math.floor(Math.random() * 10) + 1;
    bpm += Math.random() < 0.5 ? -randomChange : randomChange;
    bpm = Math.min(300, Math.max(15, bpm));
    document.getElementById('bpm-display').textContent = bpm;
}

// Show the Specified Page and Hide the Other
function showPage(pageId) {
    document.getElementById('bpm-page').style.display = pageId === 'bpm-page' ? 'flex' : 'none';
    document.getElementById('metronome-page').style.display = pageId === 'metronome-page' ? 'flex' : 'none';
}

// Initialize the Page
window.onload = () => {
    loadDarkModePreference();
    showPage('bpm-page');
    validateBPM();
};

// Event Listeners
document.getElementById('mode-toggle').addEventListener('click', toggleDarkMode);
document.getElementById('bpm-input').addEventListener('input', validateBPM);
