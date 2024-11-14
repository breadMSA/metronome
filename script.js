// JavaScript function to change the background color when the button is clicked

function changeBackgroundColor() {
    // Array of colors to cycle through
    const colors = ["#f4f4f9", "#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff", "#bdb2ff", "#ffc6ff"];
    
    // Generate a random index to pick a color
    const randomIndex = Math.floor(Math.random() * colors.length);
    
    // Set the background color of the body
    document.body.style.backgroundColor = colors[randomIndex];
}
