// Preset scrambles for each case
const scrambles = {
    "CLL-H-1": "R2 U2 F' U' R2 U' R2 U' F'",
    "CLL-H-2": "R' U R' U F R F2 R2 U2 F'",
    "CLL-H-3": "U F2 R' F2 R2 U2 R' F2 U'",
    "CLL-H-4": "F2 U2 F' R' U2 F2 U2 R' U'",
    "CLL-U-1": "U' R F2 U R2 U' F2 R' U'",
    "CLL-U-2": "F R2 U2 F' U' F U' R F'",
    "CLL-U-3": "F' U' R' F R2 U R' F U F'",
    "CLL-U-4": "F R2 F R2 F' U2 F R2 F2",
    "CLL-U-5": "F' U2 F' U' R U2 R' U F2 U'",
    "CLL-U-6": "R' U2 R U F2 U R U' F2",
    "CLL-Pi-1": "F R2 F' R U2 F' U F U R' U'",
    "CLL-Pi-2": "F R' U' F2 U F' U2 R F2 R'",
    "CLL-Pi-3": "F' U' R2 U' F2 U' F' U2 R2",
    "CLL-Pi-4": "R2 U' F' U' F R2 U2 R' U R'",
    "CLL-Pi-5": "F2 U F2 R' F2 R F2 U' F2 U2",
    "CLL-Pi-6": "R F2 R2 F' U2 F R2 F2 R'",
    "CLL-T-1": "U' R' F2 U' F U F2 R U'",
    "CLL-T-2": "U F U2 F' U2 R' F' R U'",
    "CLL-T-3": "R2 F2 U F' U' F R U' F2 R2",
    "CLL-T-4": "F U' R F' U F R2 U2 F' U'",
    "CLL-T-5": "F2 R2 F R2 F' U2 F R2 F",
    "CLL-T-6": "F2 U' F' U F2 U' R U' R'",
    "CLL-L-1": "F2 U R' U' F2 U' R' U2 R U2",
    "CLL-L-2": "R2 U' R F2 R' U R F2 R U2",
    "CLL-L-3": "F2 U' R F2 R' U2 R U' F2",
    "CLL-L-4": "R' F' R2 U2 R' F' R U2 R' U'",
    "CLL-L-5": "R2 U R U' F' U' F R' U'",
    "CLL-L-6": "U2 F' U F U2 R U2 R' U'",
    "CLL-SUNE-1": "F' R U R' U2 R' F2 R U",
    "CLL-SUNE-2": "F2 R U R2 F' R2 U' R' F2 U'",
    "CLL-SUNE-3": "U F' R U R' F U F' U2",
    "CLL-SUNE-4": "R U2 R' U2 R' F R F' U'",
    "CLL-SUNE-5": "R F' U2 F R' U2 R U R2 U",
    "CLL-SUNE-6": "F' R U' R' F2 R U2 R' U'",
    "CLL-AS-1": "U R' U2 R U R' U R U'",
    "CLL-AS-2": "R2 U' R' U2 R F' U2 F R' U2",
    "CLL-AS-3": "U F' U2 F U2 F R' F' R U'",
    "CLL-AS-4": "U2 R F' U' F R' U' R U'",
    "CLL-AS-5": "F U' F' R F2 R F2 R' U'",
    "CLL-AS-6": "R2 F R U2 F U2 R' F' R2 U2",
    // Add other cases as needed
};


// Timer Variables
let timerRunning = false;
let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let currentScramble = ""; // Holds the active scramble for the solve
let holdStartTime = 0; // Variable to track the start of the spacebar hold time
let okButtonClicked = false; // Track if the OK button was clicked
let holdTime = 500; // Default hold time threshold (in ms)
let scrambleDisplayed = false; // Track if scramble is displayed
let spacebarPressed = false;  // Flag to track spacebar press state
let spacebarPressDuration = 0;
let spacebarPressStartTime = 0;
let timerElement = document.getElementById('timerDisplay');
let timerStartTimeout;
let holdTimeReached = false;
let casesSelected = false;




// Function to select a random scramble from selected cases
function getRandomScramble(selectedCases) {
    const randomCase = selectedCases[Math.floor(Math.random() * selectedCases.length)];
    let scramble = scrambles[randomCase];


    // Define possible moves to add at the end if needed
    const possibleEndMoves = ["U", "U'", "U2"];
   
    // Extract the last move from the current scramble
    const lastMove = scramble.trim().split(" ").pop();


    // If the last move is already a "U," "U'," or "U2", don't add an extra move
    if (!possibleEndMoves.includes(lastMove)) {
        const randomMove = possibleEndMoves[Math.floor(Math.random() * possibleEndMoves.length)];
        scramble = `${scramble} ${randomMove}`.trim();
    }


    return scramble;
}




// Function to display the scramble for a selected case
function displayScramble(scramble) {
    // Check if the scramble is valid (non-empty string)
    const currentScramble = scramble || null; // Fallback to null if scramble is falsy
    const scrambleDisplay = document.getElementById('scramble-display');
    
    // Display the scramble if available, otherwise show a default message
    scrambleDisplay.textContent = currentScramble ? `Scramble: ${currentScramble}` : "Scramble not available.";
}


// Checkbox Functions
function selectAll() {
    document.querySelectorAll('.case-checkbox').forEach(checkbox => checkbox.checked = true);
    updateSelectedCount();
}


function clearSelection() {
    document.querySelectorAll('.case-checkbox').forEach(checkbox => checkbox.checked = false);
    updateSelectedCount();
}


// Update the counter display
function updateSelectedCount() {
    const selectedCount = document.querySelectorAll('.case-checkbox:checked').length;
    document.getElementById('selected-count').innerText = selectedCount;
}


// Add event listeners to all checkboxes on page load
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.case-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedCount); // Update count when checkbox changes
    });
    loadSolves(); // Load and display saved solves
});




// Ensure your OK button calls confirmSelection
document.getElementById('okButton').addEventListener('click', confirmSelection);


function startTimer() {
    if (!timerRunning && okButtonClicked && casesSelected) {
        startTime = Date.now();
        timerRunning = true;
        timerInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const seconds = (elapsed / 1000).toFixed(2);
            timerElement.textContent = seconds;
        }, 10);
        console.log("Timer started");
    } else if (!okButtonClicked || !casesSelected) {
        console.log("Cannot start timer: OK button not clicked or no cases selected");
    }
}

function stopTimer() {
    if (timerRunning) {
        clearInterval(timerInterval);
        elapsedTime = Date.now() - startTime;
        resetTimer();
        timerRunning = false;
        const solveData = {
            scramble: currentScramble,
            caseName: currentCaseName,
            time: elapsedTime,
            date: new Date().toISOString()
        };
        saveSolveLocal(solveData);
        updateSolvesDisplay(JSON.parse(localStorage.getItem("cubeSolves")));
        updateScramble();
        timerElement.style.color = ''; // Reset to default color
    }
}

// Function to update scrambleDisplayed when a scramble is generated
function setScramble(scramble) {
    // Update scramble display logic here, for example:
    document.getElementById('scrambleDisplay').innerText = scramble; // Assuming this is the ID of the scramble display element

    // Set scrambleDisplayed to true when scramble is displayed
    scrambleDisplayed = true;
}

// Reset scrambleDisplayed when the scramble is cleared
function clearScramble() {
    document.getElementById('scrambleDisplay').innerText = ''; // Clear scramble display
    scrambleDisplayed = false; // Set scrambleDisplayed to false
}


// Function to update timer display
function updateTimerDisplay() {
    elapsedTime = Date.now() - startTime; // Continuously update elapsed time
    document.getElementById('timerDisplay').innerText = formatTime(elapsedTime);
}

// Function to reset timer display
function resetTimer() {
    document.getElementById('timerDisplay').innerText = formatTime(elapsedTime); // Display the current elapsed time
}

// Function to update the scramble for the next solve
function updateScramble() {
    const selectedCases = Array.from(document.querySelectorAll('.case-checkbox:checked'))
        .map(checkbox => checkbox.value);
    if (selectedCases.length > 0) {
        const newScramble = getRandomScramble(selectedCases);
        displayScramble(newScramble);
        scrambleDisplayed = true; // Set scrambleDisplayed to true
        currentCaseName = selectedCases[Math.floor(Math.random() * selectedCases.length)];
        currentScramble = newScramble;
    }
}



// Format Time to mm:ss.ss
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10); // Get the milliseconds for two decimal places
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}.${milliseconds < 10 ? '0' : ''}${milliseconds}`; // Format to mm:ss.ss
}
//maybe remove 
// Prevent page scrolling on spacebar
document.body.addEventListener('keydown', function (e) {
    if (e.code === 'Space') {
        e.preventDefault(); // Prevent default scroll behavior
    }
});
//end maybe remove



// Event listeners
document.body.addEventListener('keydown', function (e) {
    if (e.code === 'Space') {
        e.preventDefault();
        if (!timerRunning) {
            if (!spacebarPressed) {
                console.log("Spacebar pressed!");
                spacebarPressed = true;
                timerElement.style.color = 'yellow';
                spacebarPressStartTime = Date.now();
                
                timerStartTimeout = setTimeout(() => {
                    if (spacebarPressed) {
                        timerElement.style.color = 'green';
                        holdTimeReached = true;
                    }
                }, holdTime);
            }
        } else {
            stopTimer();
        }
    }
});

// Modify the keyup event listener
document.body.addEventListener('keyup', function (e) {
    if (e.code === 'Space') {
        e.preventDefault();
        clearTimeout(timerStartTimeout);
        
        console.log("Spacebar released!");
        spacebarPressDuration = Date.now() - spacebarPressStartTime;
        console.log(`Spacebar held for ${spacebarPressDuration} ms`);
        
        if (!timerRunning && holdTimeReached && okButtonClicked && casesSelected) {
            startTimer();
        } else if (!okButtonClicked || !casesSelected) {
            console.log("Cannot start timer: OK button not clicked or no cases selected");
        }
        
        spacebarPressed = false;
        spacebarPressStartTime = 0;
        holdTimeReached = false;
        
        if (!timerRunning) {
            timerElement.style.color = ''; // Reset to default color
        }
    }
});


// Listen for the OK button click
// Modify the OK button click event listener
document.getElementById('okButton').addEventListener('click', function() {
    okButtonClicked = true;
    updateCasesSelected();
    confirmSelection();
});

// Add this function to check if cases are selected
function updateCasesSelected() {
    casesSelected = document.querySelectorAll('.case-checkbox:checked').length > 0;
}

// Add event listeners to checkboxes to update casesSelected
document.querySelectorAll('.case-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', updateCasesSelected);
});


function confirmSelection() {
    const selectedCases = Array.from(document.querySelectorAll('.case-checkbox:checked'))
        .map(checkbox => checkbox.value);


    if (selectedCases.length > 0) {
        updateScramble(); // Call updateScramble to generate and display a new scramble
        document.getElementById('timer-container').style.display = 'flex'; // Show the timer
    } else {
        alert("Please select at least one case.");
    }
}




// Modified updateSolvesDisplay to include case name
function updateSolvesDisplay(solves) {
    const solvesList = document.getElementById("solvesList");
    solvesList.innerHTML = ""; // Clear previous content


    // Display solves in reverse order (latest first) and show solve number
    if (solves.length === 0) {
        const noSolvesMessage = document.createElement("div");
        noSolvesMessage.textContent = "No solves available.";
        noSolvesMessage.classList.add("no-solves-message");
        solvesList.appendChild(noSolvesMessage);
    } else {
        solves.reverse().forEach((solve, index) => {
            const solveElement = document.createElement("div");
            solveElement.textContent = `Solve #${solves.length - index}: Time: ${formatTime(solve.time)}, Scramble: ${solve.scramble}, Case: ${solve.caseName}`;
            solveElement.classList.add("solve-entry");


            // Create a delete button
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "X"; // The button's "X"
            deleteButton.classList.add("delete-btn");


            // Add event listener to delete the solve when clicked
            deleteButton.addEventListener("click", function() {
                deleteSolve(solve); // Delete the solve from the list
            });


            solveElement.appendChild(deleteButton);
            solvesList.appendChild(solveElement);
        });
    }
}


// Function to save solves locally in localStorage
function saveSolveLocal(solveData) {
    let solves = JSON.parse(localStorage.getItem("cubeSolves")) || [];
    solveData.caseName = currentCaseName; // Add the case name to the solve data
    solves.push(solveData);
    localStorage.setItem("cubeSolves", JSON.stringify(solves));
    updateSolvesDisplay(solves);
}






// Function to load past solves from localStorage and update the display
function loadSolves() {
    const storedSolves = JSON.parse(localStorage.getItem("cubeSolves")) || [];
    updateSolvesDisplay(storedSolves); // Update the UI with the solves
}


// Function to delete a solve from localStorage
function deleteSolve(solve) {
    let solves = JSON.parse(localStorage.getItem("cubeSolves")) || [];
    solves = solves.filter(storedSolve => storedSolve.scramble !== solve.scramble || storedSolve.time !== solve.time);
    localStorage.setItem("cubeSolves", JSON.stringify(solves));
    updateSolvesDisplay(solves); // Refresh the list after deletion
}


// Load past solves as soon as the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadSolves(); // Load and display saved solves
});

// Load saved settings from localStorage if they exist
window.onload = function() {
    const savedHoldTime = localStorage.getItem('holdTime');
    if (savedHoldTime) {
        holdTime = parseInt(savedHoldTime, 10); // Retrieve saved value for hold time
    }
    document.getElementById('holdTime').value = holdTime; // Set the input value to the saved hold time
};

// Clear solves from localStorage
function clearSolves() {
    localStorage.removeItem("cubeSolves");
    const solvesList = document.getElementById("solvesList");
    if (solvesList) {
        solvesList.innerHTML = "";
    } else {
        console.error('Element #solvesList not found');
    }
}


// Initialize past solves display on page load
document.addEventListener('DOMContentLoaded', () => {
    loadSolves(); // Load and display saved solves
});


// Confirm solve completion
function onSolveComplete(time, scramble) {
    const solveData = { time, scramble, date: new Date().toISOString() };
    saveSolveLocal(solveData);
}


document.addEventListener('DOMContentLoaded', () => {
    // Handle subsets (case subsets)
    document.querySelectorAll('.subset-header').forEach(header => {
        const content = header.nextElementSibling;


        // Collapse content initially
        content.style.display = 'none';


        // Toggle display on click
        header.addEventListener('click', () => {
            content.style.display = content.style.display === 'none' ? 'flex' : 'none';
        });
    });


    // Handle case content
    document.querySelectorAll('.case-header').forEach(header => {
        const content = header.nextElementSibling;


        // Ensure content is initially collapsed
        content.classList.add('collapsed'); // Add the collapsed class


        // Toggle between collapsed and expanded on click
        header.addEventListener('click', () => {
            content.classList.toggle('collapsed'); // Toggle collapsed class
        });
    });
});




// themes


document.querySelectorAll('.theme-option').forEach(option => {
    option.addEventListener('click', (event) => {
        const selectedTheme = event.target.getAttribute('data-theme');
        document.body.classList.remove('light-mode', 'dark-mode', 'cyan-black-mode');
        document.body.classList.add(selectedTheme);
       
        // Optional: Save the theme to localStorage for persistence
        localStorage.setItem('selectedTheme', selectedTheme);
    });
});


// Load saved theme from localStorage if available
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('selectedTheme') || 'light-mode';
    document.body.classList.add(savedTheme);
});


// settings


// Listen for the Settings button click to open the settings popup
document.getElementById('settingsButton').addEventListener('click', function () {
    openSettings();
});

// Function to open the settings popup
function openSettings() {
    document.getElementById('settingsPopup').style.display = 'block'; // Show the settings popup
}

// Function to close the settings popup
function closeSettings() {
    document.getElementById('settingsPopup').style.display = 'none'; // Hide the settings popup
}

// Function to save settings and update hold time
function saveSettings() {
    const newHoldTime = parseInt(document.getElementById('holdTime').value, 10); // Get new hold time from input
    if (!isNaN(newHoldTime) && newHoldTime >= 100) { // Ensure valid value
        holdTime = newHoldTime; // Update hold time threshold
        localStorage.setItem('holdTime', holdTime); // Save hold time to localStorage
        console.log(`Hold time updated to ${holdTime}ms.`);
        closeSettings(); // Close the settings popup
    } else {
        console.log("Invalid hold time value.");
    }
}
