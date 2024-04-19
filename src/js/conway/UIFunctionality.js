/*
* UIFunctionality.js
* Authors: Kyle Tranfaglia, Timmy McKirgan, Dustin O'Brien
* This file handles all user interface Functionality. It is the bulk of the program and handles all button clicks,
  information inputs, mouse actions, lattice changes, cell changes, iterations, and updates/calculates information
  for simulation modifications and communicates it with utility files
* Last Updated: 04/18/24
*/

/* Global constants connecting HTML buttons to JS by ID to impliment functionality */   

/* Input Box Submit Button Constant for Iterations */
const iterationInputBox = document.getElementById("iterationInputBox");
const iterationSubmit = document.getElementById("iterationSubmit");

/* Connect main buttons */
const startStopButton = document.getElementById("startStopButton");
const iterateButton = document.getElementById("iterateButton");
const clearResetButton = document.getElementById("clearResetButton");
const libraryButton = document.getElementById("libraryButton");
const aboutButton = document.getElementById("aboutButton");

/* Connect iteration slider */
const iterationSpeedSlider = document.getElementById("iterationSpeedSlider");
const iterationSpeedValue = document.getElementById("iterationSpeedValue");

const aboutWindow = document.getElementById("aboutContainer");  // Connect window for about
const closeAbout = document.querySelector("#aboutContent .close");  // Connect HTML/CSS close feature to JS for the about window

/* Global variables for iteration */
let addIterations = 0; // Defaults iterations
let Run = 0; // Defaults to not keep running
let iterationTime = 250; // Time to wait before iterating again

/* Handle button clicks for all primary toolbar buttons */

iterationSubmit.addEventListener("click", function() {

});

startStopButton.addEventListener("click", function() {

});

iterateButton.addEventListener("click", function() {
    
});

clearResetButton.addEventListener("click", function() {
    
});

libraryButton.addEventListener("click", function() {
    
});

aboutButton.addEventListener("click", function() {
    
});

// Recognize a keydown event, as in keyboard key press, then check and hnadle key presses. Used for keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Check if ALT key is pressed, then check if another key is pressed and complete corresponding action
    if (event.altKey) {
		switch (true) {
            case (event.key == 'j'):
				iterationInputBox.focus();
				break;
			case (event.key == 'Enter'):
				startStopButton.click();
				break;
			case (event.key == 'i'):
				iterateButton.click();
				break;
			case (event.key == 'c'):
				clearButton.click();
				break;
			case (event.key == 'l'):
				libraryButton.click();
				break;
			case (event.key == 'a'):
				aboutButton.click();
				break;
			case (event.key == 'y'):
				iterationSpeedSlider.focus();
				break;
			case (event.key == '='):
				let dustin = document.querySelector(".Dustin");
				if (dustin.style.display == "block") {
					dustin.style.display = "none"
				}
				else {
					dustin.style.display = "block"
				}
				break;
			default:
				break;
		}
	// Enter key clicked, check if an inputbox is active and click submit for that box
	} else if (event.key == 'Enter') {
		iterationSubmit.click();
	}
});

/* Handle open and closing of about window */
// About button is clicked, display about window
aboutButton.addEventListener("click", function() {
	aboutWindow.style.display = "block";
});

// Close if x (close) button in top right of the window is clicked
/* ERROR HERE
closeAbout.addEventListener("click", function() {
	aboutWindow.style.display = "none";
});
*/

// Close if any space outside of the about window is clicked
window.addEventListener("click", function(event) {
	// Check if about window is mouse target (outside text frame was clicked) and, if so, hide about window
	if (event.target == aboutWindow) {
		aboutWindow.style.display = "none";
	}
});

iterationSpeedValue.innerHTML = 750;  // Sets displayed default iteration speed value

// Update the current iteration speed slider value upon drag
iterationSpeedSlider.oninput = function() {
	iterationSpeedValue.innerHTML = this.value;
	// setDelay(this.value);
};

//outputIteration.innerHTML = "Iteration Count: 0"; // Display (initial) iteration count to HTML page (ERROR HERE)