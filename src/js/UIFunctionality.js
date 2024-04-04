/*
* UIFunctionality.js
* Authors: Kyle Tranfaglia, Timmy McKirgan, Dustin O'Brien
* This file handles all user interface Functionality. It is the bulk of the program and handles all button clicks,
  information inputs, mouse actions, lattice changes, cell changes, iterations, and updates/calculates information
  for simulation modifications and communicates it with utility files
* Last Updated: 03/11/24
*/
import {latticeArray, rule, canvas, ctx, outputIteration, alterRuleNum, tctx, tickCanvas, logCanvas, currentLattice, drawLattice} from './displayLattice.js';
import {numOfIterations, currentIteration, size, latSize, ruleNum, inf} from './displayLattice.js';
import {alterLatSize, alterSize, alterLatticeArray, alterCurrentLattice, alterNextLattice} from './displayLattice.js';
import {alterRule, alterNumOfIterations, alterCurrentIteration, alterBoundaryCon, alterInf} from './displayLattice.js';
import {updateLattice} from './displayLattice.js';
import {ruleNumToRule} from './generateLattice.js';
import {cell} from './cellClass.js';
import {logMessage} from './logClass.js';


/* Global constants connecting HTML buttons to JS by ID to impliment functionality */   
const iterationInputBox = document.getElementById("iterationInputBox");
const ruleInputBox = document.getElementById("ruleInputBox");
const latticeSizeBox = document.getElementById("latticeSizeBox");

const iterationSubmit = document.getElementById("iterationSubmit");
const ruleSubmit = document.getElementById("ruleSubmit");
const latticeSizeSubmit = document.getElementById("latticeSizeSubmit");

const startStopButton = document.getElementById("startStopButton");
const iterateButton = document.getElementById("iterateButton");
const clearButton = document.getElementById("clearButton");
const downloadPDFButton = document.getElementById("downloadPDFButton");
const downloadPNGButton = document.getElementById("downloadPNGButton");
const aboutButton = document.getElementById("aboutButton");
const optionsButton = document.getElementById("optionsButton");

const periodicCheckBox = document.getElementById("periodicCheckBox");
const nullCheckBox = document.getElementById("nullCheckBox");

const boundToggle = document.getElementById("boundToggle");
const iterationToggle = document.getElementById("iterationToggle");
const borderToggle = document.getElementById("borderToggle");

const aboutWindow = document.getElementById("aboutContainer");
const optionsWindow = document.getElementById("optionsContainer");

const iterationSpeedSlider = document.getElementById("iterationSpeedSlider");
const iterationSpeedValue = document.getElementById("iterationSpeedValue");

/* Global constants connecting HTML/CSS features to JS by class name to impliment functionality */
const checkboxes = document.querySelectorAll(".checkbox_select");
const boundToggleButton = document.querySelector("#boundToggle .toggle_button");
const iterationToggleButton = document.querySelector("#iterationToggle .toggle_button");
const borderToggleButton = document.querySelector("#borderToggle .toggle_button");
const closeAbout = document.querySelector("#aboutContent .close");
const closeOptions = document.querySelector("#optionsContent .close");

/* Global variables for iteration */
//const popTime = 750; //Time Log messages stay on the screen
let addIterations = 0; // Defaults iterations
let Run = 0; // Defaults to not keep running
let iterationTime = 750; //Time to wait before iterating again
let tickerToggle = 1; //Ticker toggle decides if row ticker will be on defaults to on

// toggleCheckbox(); // Call function to defualt finte (periodic) simulation instead of finite

let messageQueue = []

ruleSubmit.addEventListener("click", function() {
	if (Run == 1) {
		Run = 0;
		makeLog("Stopping Iterations", logCanvas, messageQueue);
	}
	setRule(rule);
})
/*
toggleBar.addEventListener("click", function() {
	toggleCheckbox();
});
*/

iterateButton.addEventListener("click", function() {
	if (Run == 1) {
		Run = 0;
		makeLog("Stopping Iterations", logCanvas, messageQueue);
	}
	alterInf(inf[0], true)
	makeLog("Iterated to " + addIterations, logCanvas, messageQueue);
	if (latticeArray.length == 1) {
		let bufferArr = new Array()
		let latPlusBufferArr = new Array()
		for (let i = 0; i < latSize[0]; i++) {
			latPlusBufferArr.push(latticeArray[0][i].getColor())
		}
		for (let i = 0; i < latSize[1]; i++) {
			bufferArr.push(0)
		}
		latPlusBufferArr = bufferArr.concat(latPlusBufferArr.concat(bufferArr));
		let newCellNum = (latSize[0] + (2 * latSize[1]))
		if (!isNaN(newCellNum) && newCellNum >= 1) {
			alterLatSize(newCellNum);
		}
		let size = canvas.width / latSize[0];
		//Cells should have a maximum size of 45 :: This Caps cell size to 45
		if (size > 45) {
			size = 45; 
		}
		alterSize(size);
		clear(latticeArray, canvas);
		let neoLatticeArray = latticeArray;
		for (let i = 0 ; i < latticeArray[0].length; i++) {
			if (latPlusBufferArr[i] == 1) {
				neoLatticeArray[0][i].flipColor();
			}
			(neoLatticeArray[0][i]).drawCell(ctx);
			alterLatticeArray(neoLatticeArray);
		}
	}
	iterate(currentIteration, addIterations);
});

clearButton.addEventListener("click", function() {
	if (Run == 1) {
		Run = 0;
		makeLog("Stopping Iterations", logCanvas, messageQueue);
	}

	let newCellNum = (latSize[0] - (2 * latSize[1]));
	if (!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) {
		alterLatSize(newCellNum);
	}
	else {
		makeError("Invalid Lattice Size: " + latticeSizeBox.value, logCanvas, messageQueue)
	}
	let size = canvas.width / latSize[0];
	//Cells should have a maximum size of 45 :: This Caps cell size to 45
	if (size > 45) {
		size = 45; 
	}
	alterSize(size);
	clear(latticeArray, canvas);
	makeLog("Cleared Lattice ", logCanvas, messageQueue);
	alterInf(inf[0], false);}
);
/* Connect UI Functionality to a prebuilt function */
boundToggle.addEventListener("click", function() {
	if (Run == 1) {
		Run = 0;
		makeLog("Stopping Iterations", logCanvas, messageQueue);
	}
	toggleCheckbox();
});

iterationToggle.addEventListener("click", function() {
	iterationToggleOption();
});

borderToggle.addEventListener("click", function() {
	borderToggleOption();
});

iterationSubmit.addEventListener("click", function() {
	if (Run == 1) {
		Run = 0;
		makeLog("Stopping Iterations", logCanvas, messageQueue);
	}
	setLatticeSize();
});
//Sets the number of cells in a lattice
latticeSizeSubmit.addEventListener("click", function() {
	if (Run == 1) {
		Run = 0;
		makeLog("Stopping Iterations", logCanvas, messageQueue);
	}
	updateLatticeSize(canvas);
});

startStopButton.addEventListener("click", function() {
	startStopToggle();
	if (Run != 1) {
		Run = 1;
		makeLog("Starting Iterations", logCanvas, messageQueue);
		
		if (latticeArray.length == 1) {
			let bufferArr = new Array()
			let latPlusBufferArr = new Array()
			for (let i = 0; i < latSize[0]; i++) {
				latPlusBufferArr.push(latticeArray[0][i].getColor())
			}
			for (let i = 0; i < latSize[1]; i++) {
				bufferArr.push(0)
			}
			latPlusBufferArr = bufferArr.concat(latPlusBufferArr.concat(bufferArr));
			let newCellNum = (latSize[0] + (2 * latSize[1]))
			if (!isNaN(newCellNum) && newCellNum >= 1) {
				alterLatSize(newCellNum);
			}
			let size = canvas.width / latSize[0];
			//Cells should have a maximum size of 45 :: This Caps cell size to 45
			if (size > 45) {
				size = 45; 
			}
			alterSize(size);
			clear(latticeArray, canvas);
			let neoLatticeArray = latticeArray;
			for (let i = 0 ; i < latticeArray[0].length; i++) {
				if (latPlusBufferArr[i] == 1) {
					neoLatticeArray[0][i].flipColor();
				}
				(neoLatticeArray[0][i]).drawCell(ctx);
				alterLatticeArray(neoLatticeArray);
			}
		}
		
		continouslyIterate(iterationTime);
	}
	else {
		Run = 0;
		makeLog("Stopping Iterations", logCanvas, messageQueue);
		startStopToggle();
	}
});

//Continously Checks where the mouse is on the Canvas too allow tick box to next to it
tickCanvas.addEventListener("mousemove", function(event) {makeTickBox(event, tctx)});

// Runs program to flips squares if Clicked
tickCanvas.addEventListener('click', function(event) {
	let mouseX, mouseY;
	[mouseX, mouseY] = getMouseLocation(event); // Calculates Proper location of mouse click for usage in setCells
	setCells(latticeArray, mouseX, mouseY);	// Flips the cell if it was clicked on
});

// function updateLatticeSize() {
// 	alterLatSize(setCellNum(latSize)); //updates latSize to no latSize
	
// 	//Sets cells to maximize usage of the canvas
// 	alterSize(canvas.width / latSize);
// 	//Cells should have a maximum size of 45
// 	if (size > 45){
// 		alterSize(45);
// 	}
	
// 	clear(latticeArray, canvas);
// }

// Updates the number of cells in a lattice and resizes cells to coorespond with new size
function updateLatticeSize(canvas) {
	let newCellNum = parseInt(latticeSizeBox.value);
	
	if (!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) {
		alterLatSize(newCellNum);
		makeLog("Lattice Size Set to: " + newCellNum, logCanvas, messageQueue)
	}
	else {
		makeError("Invalid Lattice Size: " + latticeSizeBox.value, logCanvas, messageQueue)
	}
	
	let size = canvas.width / latSize[0];

	//Cells should have a maximum size of 45 :: This Caps cell size to 45
	if (size > 45) {
		size = 45; 
	}
	
	alterSize(size);
	alterInf(inf[0], false)
	
	clear(latticeArray, canvas); //emptys out canvas and redraws
}

//generates the tick box in its proper location
function makeTickBox(event) {
	if (tickerToggle == 1) {
		var [mouseX, mouseY] = getMouseLocation(event); //Gets the mouse Location
		
		tctx.clearRect(0,0, tickCanvas.width, tickCanvas.height);

		//drawLattice(latticeArray);
		tctx.fillStyle = "grey";
		tctx.fillRect(mouseX + 3, mouseY - 12, 33, 15); //Draws the Tick Box square

		//Sets text specifications
		tctx.font = "13px Arial";
		tctx.fillStyle = "black";

		let lineNumber = Math.floor(mouseY / size); //calculates what line your on

		tctx.fillText(lineNumber, mouseX + 4, mouseY) //Puts the text in place
	}
}

//repeatly iterates while run is true
function continouslyIterate(iterationTime) {
	//Checks if Run is activate
	if (Run) {
		setTimeout(function(){ // puts a wait before iterating again
			if (Run) {
				iterate(currentIteration, 1); //iterates the number of lattices
			}
			continouslyIterate(iterationTime); // allows it to coninously run by calling it again
		}, iterationTime);
	}
	else {
		startStopToggle(currentIteration);
	}
}

function setRule() {
	let newRule = parseInt(ruleInputBox.value); //Turns input in rule input box into a number
	Run = 0; //Tells continous to not run
	//Checks if integer was a real integer and if its in the required range of the function
	if (!isNaN(newRule) && newRule >= 0 && newRule <= 255) {
		alterRuleNum(newRule);
		alterRule(ruleNumToRule(newRule));
		makeLog("Rule Set to: " + newRule, logCanvas, messageQueue);

		let newCellNum = (latSize[0] - (2 * latSize[1]));
		if (!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) {
			alterLatSize(newCellNum);
		}
		else {
			makeError("Invalid Lattice Size: " + latticeSizeBox.value, logCanvas, messageQueue)
		}
		let size = canvas.width / latSize[0];
		//Cells should have a maximum size of 45 :: This Caps cell size to 45
		if (size > 45) {
			size = 45; 
		}
		alterSize(size);

		alterInf(inf[0], false)
		clear(latticeArray, canvas);
	}
	else {
		makeError("Invalid Lattice Size: " + ruleInputBox.value, logCanvas, messageQueue);
	}
}

//Sets new number of cells in a lattice
/*function setCellNum(latSize) {
	let newCellNum = parseInt(latticeSizeBox.value); //Turns Input box input into a number
	if(!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) //Tests if input was truly an integer and then makes sure it was in the range of 1 and 1000 to make sure not too big
	{
		latSize = newCellNum;
	} //updates the new cell number
	else
	{
	} //outputs the error to console currently

	return latSize; //returns the new lattice Size
}*/

//sets Number of Lattice arrays to have
function setLatticeSize() {
	let newValue = parseInt(iterationInputBox.value); //Turns the iteration input to an integerpopTime
	if (!isNaN(newValue) && newValue >= 0 && newValue <= 1000) {

		let newCellNum = (latSize[0] - (2 * latSize[1]));
		if (!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) {
			alterLatSize(newCellNum);
		}
		else {
			makeError("Invalid Lattice Size: " + latticeSizeBox.value, logCanvas, messageQueue)
		}
		let size = canvas.width / latSize[0];
		//Cells should have a maximum size of 45 :: This Caps cell size to 45
		if (size > 45) {
			size = 45; 
		}
		alterSize(size);
		
		alterInf(inf[0], false, newValue);
		clear(latticeArray, canvas);
		addIterations = newValue;//updates the number of iterations
		makeLog("Set Iterations to: " + newValue, logCanvas, messageQueue);
	}
	else
	{
		makeError("Invalid Lattice Size: " + iterationInputBox.value, logCanvas, messageQueue);
	}
	return addIterations;
}

//gets rid of all arays except the first and sets all cells to dead (white)
function clear(latticeArray) {
	canvas.height = 400;
	alterNumOfIterations(1);
	alterCurrentIteration(1);
	let clearedLattice = new Array (new Array);
	alterNextLattice(new Array);
	let StartX = (canvas.width / 2) - (latSize[0] * size / 2)
	let neoLatticeArray = latticeArray;
	while (neoLatticeArray.length > 1) {
		neoLatticeArray.pop();
	}
	for (let i = 0; i < latSize[0]; i++) {
		clearedLattice[0][i] = (new cell (size, size, StartX + i * size, 0, 0));
	}
	neoLatticeArray[0] = clearedLattice[0].slice(0);
	alterLatticeArray(neoLatticeArray);
	alterCurrentLattice(latticeArray[0]);
	updateLattice();
}

//Takes Coordinates of mouseClick and calculates properly where it is in relation to the canvas
function setCells(latticeArray, mouseX, mouseY) {
	let neoLatticeArray = latticeArray;
	if (latticeArray.length == 1) {
		for (let i = 0 ; i < latticeArray[0].length; i++) {
			if (latticeArray[0][i].insideCell(mouseX, mouseY)) {
				neoLatticeArray[0][i].flipColor();
			}
			(neoLatticeArray[0][i]).drawCell(ctx);
			alterLatticeArray(neoLatticeArray);
		}
	}
}

function getMouseLocation(event) {
	//Gets the posistion of the edges of canvas
	let bounds = canvas.getBoundingClientRect();

	// Calculates Height and Width cooresponding to CSS setting of Canvas
	let cssWidth = parseFloat(getComputedStyle(canvas).getPropertyValue('width'));
	let cssHeight = parseFloat(getComputedStyle(canvas).getPropertyValue('height'));
	
	//Calculates the width of the thin border that wraps around the canvas allowing for pixel perfect clicking
	let borderWidth = parseInt(getComputedStyle(canvas).borderLeftWidth);
	
	//Gets the amount of padding which isnt generally considered in the mouse click
	let paddingLeft = parseFloat(getComputedStyle(canvas).paddingLeft);
	let paddingTop = parseFloat(getComputedStyle(canvas).paddingTop);
	
	//calculates mouse X and mouse Y of the Mouse during click and then distorts and move the location to where it needs cooresponding
	let mouseX = (event.clientX - bounds.left - paddingLeft - borderWidth) * canvas.width / cssWidth;
	let mouseY = (event.clientY - bounds.top - paddingTop - borderWidth) * canvas.height / cssHeight;

	return [mouseX, mouseY];
}

function iterate(currentIteration, newIterations) {
	if (numOfIterations + newIterations > addIterations) {
		alterNumOfIterations(addIterations + 1);
		Run = 0;
	}
	else {
		alterNumOfIterations(numOfIterations + newIterations);
	}
	let neoLatticeArray = latticeArray;
	while(neoLatticeArray.length > numOfIterations) {
		neoLatticeArray.pop();
	}

	alterLatticeArray(neoLatticeArray);
	updateLattice();
	return currentIteration;
}

// Handle when bound toggle buton is activated: Animate toggle button, display checkboxes, select first checkbox
export function toggleCheckbox() {
	// Set the first checkbox (not second checkbox) to be checked upon toggle button activation
  checkboxes[0].checked = true;
	checkboxes[1].checked = false;
	// If checkboxes are currently hidden (toggle bar was not active) display the checkboxes and animate toggle button
	if (periodicCheckBox.style.display == 'none'|| periodicCheckBox.style.display == '') {

		let newCellNum = (latSize[0] - (2 * latSize[1]));
		if (!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) {
			alterLatSize(newCellNum);
		}
		else {
			makeError("Invalid Lattice Size: " + latticeSizeBox.value, logCanvas, messageQueue)
		}
		let size = canvas.width / latSize[0];
		//Cells should have a maximum size of 45 :: This Caps cell size to 45
		if (size > 45) {
			size = 45; 
		}
		alterSize(size);

		alterInf(false)
		makeLog("Setting to Finite", logCanvas, messageQueue);
		clear(latticeArray, canvas);
		periodicCheckBox.style.display = 'block';
		nullCheckBox.style.display = 'block';
		boundToggleButton.style.transform = 'translateX(25px)'; // Move the toggle button to the right
	// If checkboxes are currently not hidden (toggle bar was active) hide the checkboxes and animate toggle button back
    } else {

			let newCellNum = (latSize[0] - (2 * latSize[1]));
			if (!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) {
				alterLatSize(newCellNum);
			}
			else {
				makeError("Invalid Lattice Size: " + latticeSizeBox.value, logCanvas, messageQueue)
			}
			let size = canvas.width / latSize[0];
			//Cells should have a maximum size of 45 :: This Caps cell size to 45
			if (size > 45) {
				size = 45; 
			}
			alterSize(size);

			alterInf(true)
			makeLog("Setting to Infinite", logCanvas, messageQueue);
			clear(latticeArray, canvas);
			periodicCheckBox.style.display = 'none';
			nullCheckBox.style.display = 'none';
			boundToggleButton.style.transform = 'translateX(0)'; // Move the toggle button back to the left
    }
}

/* Initialize toggle buttons to x position 0px to enable x translation in functions */
iterationToggleButton.style.transform = "translateX(0px)";
borderToggleButton.style.transform = "translateX(0px)";

// Handle when iteration toggle button is activated
function iterationToggleOption() {
	// Toggle the position of the button
	if (iterationToggleButton.style.transform == "translateX(0px)") {
		iterationToggleButton.style.transform = "translateX(25px)";
	} 
	else {
		iterationToggleButton.style.transform = "translateX(0px)";
	}
}

// Handle when border toggle button is activated
function borderToggleOption() {
	// Toggle the position of the button
	if (borderToggleButton.style.transform === "translateX(0px)") {
		borderToggleButton.style.transform = "translateX(25px)";
	} 
	else {
		borderToggleButton.style.transform = "translateX(0px)";
	}
}

// function outputError(text) {
// 	errorContext.font = "12px Arial";
// 	errorContext.fillStyle = "red";

// 	errorContext.fillText(text, 5, 25)
// 		setTimeout(function(){

// 	}, 750);
// }

// Handle switching GUI for Start/Stop Button upon click
function startStopToggle() {
	// If the button is in start state, change it to stop state and vice versa
	if (startStopButton.classList.contains("start_button") && !Run) {
    	startStopButton.innerHTML = "Stop";
    	startStopButton.classList.remove("start_button");
    	startStopButton.classList.add("stop_button");
			alterInf(inf[0], true)
  	} 
  	else {
    	startStopButton.innerHTML = "Start";
    	startStopButton.classList.remove("stop_button");
    	startStopButton.classList.add("start_button");
  	}
}

// Ensure one and only one checkbox can be checked at a time upon checkbox click
checkboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
			if (Run == 1) {
				Run = 0;
				makeLog("Stopping Iterations", logCanvas, messageQueue);
			}
		// Box is set to be checked upon change
        if (this.checked) {
            checkboxes.forEach(function(otherCheckbox) {
				// If one checkbox is already checked, uncheck the other checkbox
				if (otherCheckbox != checkbox) {
                    otherCheckbox.checked = false;
                }
            });
			//If the first checkbox is selected, set the boundaryCon variable to 1 representing Periodic
			//boundary condition. Otherwise set boundaryCon to 0 representing Null.
			if (checkboxes[0].checked) {
				alterBoundaryCon(1);
				makeLog("Setting to Periodic", logCanvas, messageQueue);

				let newCellNum = (latSize[0] - (2 * latSize[1]));
				if (!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) {
					alterLatSize(newCellNum);
				}
				else {
					makeError("Invalid Lattice Size: " + latticeSizeBox.value, logCanvas, messageQueue)
				}
				let size = canvas.width / latSize[0];
				//Cells should have a maximum size of 45 :: This Caps cell size to 45
				if (size > 45) {
					size = 45; 
				}
				alterSize(size);

				clear(latticeArray, canvas);
			}
			else {
				alterBoundaryCon(0);
				makeLog("Setting to Null", logCanvas, messageQueue);

				let newCellNum = (latSize[0] - (2 * latSize[1]));
				if (!isNaN(newCellNum) && newCellNum >= 1 && newCellNum <= 1000) {
					alterLatSize(newCellNum);
				}
				else {
					makeError("Invalid Lattice Size: " + latticeSizeBox.value, logCanvas, messageQueue)
				}
				let size = canvas.width / latSize[0];
				//Cells should have a maximum size of 45 :: This Caps cell size to 45
				if (size > 45) {
					size = 45; 
				}
				alterSize(size);

				clear(latticeArray, canvas);
			}
        }
		// Box is set to be unchecked: Don't allow ... one box must be checked at all times
		else {
			this.checked = true;
		}
    });
});


// Adds an error to message log
function makeError(errorMessage, logCanvas, messageQueue) {
	let tempLog = new logMessage(errorMessage, 'red', logCanvas);
	messageQueue.unshift(tempLog);
	displayLog(messageQueue, logCanvas);
	//setPopLogTimer(messageQueue, logCanvas)
}

// Adds an log to message log
function makeLog(errorMessage, logCanvas, messageQueue) {
	let tempLog = new logMessage(errorMessage, 'black', logCanvas);
	messageQueue.unshift(tempLog);
	displayLog(messageQueue, logCanvas);
	//setPopLogTimer(messageQueue, logCanvas)
}

//outputs correct elements of the message log
function displayLog(messageQueue, logCanvas) {
	let dummyMessage = new logMessage("God Bless Karl Marx", 'red', logCanvas); //Message used to just clear canvas
	dummyMessage.clearCanvas();
	for (let i = 0; i < messageQueue.length; i++) {
		messageQueue[i].displayMessage(i);
	}
}

/*function setPopLogTimer(messageQueue, logCanvas) {
	// puts a wait before iterating again
	setTimeout(function() { 
		messageQueue.pop();
		displayLog(messageQueue, logCanvas);
	}, popTime);
}*/

// Capture canvas as a PDF upon clickling the 'Download PDF" button
downloadPDFButton.addEventListener('click', function() {
	let imgData = canvas.toDataURL("image/png");  // Get the image data from the canvas
	let pdf = new jsPDF('p', 'pt', [canvas.width, canvas.height]);  // Create a new PDF document with the canvas dimensions as page size

	// Calculate the aspect ratio of the canvas content
	let canvasAspectRatio = canvas.width / canvas.height;

	// Calculate the aspect ratio of the PDF page
	let pdfWidth = pdf.internal.pageSize.getWidth();
	let pdfHeight = pdf.internal.pageSize.getHeight();
	let pdfAspectRatio = pdfWidth / pdfHeight;

	// Default image dimensions with assumption that the canvas is taller than PDF page
	let imgWidth = pdfHeight * canvasAspectRatio;
	let imgHeight = pdfHeight;

	// Change size of the image in the PDF using the aspect ratios if canvas is wider than PDF page
	if (canvasAspectRatio > pdfAspectRatio) {
		imgWidth = pdfWidth;
		imgHeight = pdfWidth / canvasAspectRatio;
	} 
 
	// Add the image to the PDF document and center it on the page
	let offsetX = (pdfWidth - imgWidth) / 2;
	let offsetY = (pdfHeight - imgHeight) / 2;
	pdf.addImage(imgData, 'PNG', offsetX, offsetY, imgWidth, imgHeight);

	pdf.save("Wolfram1DCanvas" + "I" + numOfIterations + "R" + ruleNum + "L" + latSize[0] + ".pdf");  // Save the PDF
	makeLog("Downloaded Lattice Array", logCanvas, messageQueue);
});

// Capture canvas as a PNG upon clickling the 'Download PNG" button
downloadPNGButton.addEventListener('click', function() {
    let image = canvas.toDataURL();  // Get the image data from the canvas. Default is png
    let link = document.createElement('a');  // Create a new anchor element to create a downloadable link
    link.href = image;  // Set the href attribute of the anchor element to the data URL of the image
    link.download = "Wolfram1DCanvas" + "I" + numOfIterations + "R" + ruleNum + "L" + latSize[0] + ".png";  // Set the filename
	link.click();  // Trigger a click on the anchor element to prompt the browser to download the image
});

/* Handle open and closing of about window */
// About button is clicked, display about window
aboutButton.addEventListener("click", function() {
	aboutWindow.style.display = "block";
});

// Close if x (close) button in top right of the window is clicked
closeAbout.addEventListener("click", function() {
	aboutWindow.style.display = "none";
});

// Close if any space outside of the about window is clicked
window.addEventListener("click", function(event) {
	// Check if about window is mouse target (outside text frame was clicked) and, if so, hide about window
	if (event.target == aboutWindow) {
		aboutWindow.style.display = "none";
	}
});

/* Handle open and closing of options window */
// Options button is clicked, display options window
optionsButton.addEventListener("click", function() {
	optionsWindow.style.display = "block";
});

// Close if x (close) button in top right of the window is clicked
closeOptions.addEventListener("click", function() {
	optionsWindow.style.display = "none";
});

iterationSpeedValue.innerHTML = 750;  // Sets displayed default iteration speed value

// Update the current iteration speed slider value upon drag
iterationSpeedSlider.oninput = function() {
	iterationSpeedValue.innerHTML = this.value;
};

outputIteration.innerHTML = "Iteration Count: 0"; // Display (initial) iteration count to HTML page