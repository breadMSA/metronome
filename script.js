// JavaScript function to add a new message to the page when the button is clicked

function addMessage() {
    // Create a new paragraph element
    const newMessage = document.createElement("p");
    
    // Set the content of the paragraph
    newMessage.textContent = "This is a new message!";
    
    // Style the new message (optional)
    newMessage.style.color = "#007bff";
    newMessage.style.fontSize = "1.1em";
    newMessage.style.fontWeight = "bold";
    
    // Add the new message to the body of the page
    document.body.appendChild(newMessage);
}
