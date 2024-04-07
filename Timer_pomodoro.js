let isTimerPaused;
let isTimerReset; 
let timeRemaining;
let timerInterval; 
let initialTime = 0;
let breakTime = 0; 
let endTime = 0; 
let pauseStartTime = 0; 
let isBreak; 
let cycleCount = 0; 
let currentCycle = 0; 

document.getElementById('studyForm2').addEventListener('submit', function(event) {
    event.preventDefault();

    initialTime = parseInt(document.getElementById('studyTime').value, 10) * 60000;
    breakTime = parseInt(document.getElementById('breakTime').value, 10) * 60000;
    cycleCount = parseInt(document.getElementById('cycleCount').value, 10);

    isTimerPaused = false;
    isTimerReset = false; 
    isBreak = false; 
    currentCycle = 0;

    startNextCycle();  
});


function startNextCycle() {
    if (currentCycle < cycleCount) { 
        alert(`Starting study cycle ${currentCycle + 1} of ${cycleCount}`);
        startTimer(initialTime); 
        currentCycle++;
    } else 
    {
        alert("All study cycles completed!");
    }
}


document.getElementById('stopButton').addEventListener('click', function(event) {
    event.preventDefault(); 
    if (!isTimerPaused){
        pauseStartTime = Date.now(); 
    }
    else {
        const pauseDuration = Date.now() - pauseStartTime; 
        endTime += pauseDuration; 
    }
    isTimerPaused = !isTimerPaused; 
}); 


document.getElementById('resetButton').addEventListener('click', function(event) {
    event.preventDefault();
    clearInterval(timerInterval); 
    isTimerPaused = true; 
    timeRemaining = initialTime; 
    updateTimerDisplay(initialTime); 
}); 


function updatePomodoroImage(time){

    let totalTime = initialTime; 
    let elapdesTime = totalTime - time; 
    let circle = document.querySelector('.emoji svg circle'); 

    let cirucumference = 2 * Math.PI * circle.getAttribute('r'); 
    let offset = cirucumference * (elapdesTime / totalTime); 

    circle.style.strokeDashoffset = offset;

    let timePercent = time / initialTime; 
    let mouth = document.querySelector('.mouth');

    let borderRadiusTop, borderRadiusBottom;
    if (timePercent > 0.75) {
        let transitionPercent = (1 - timePercent) / 0.25;
        borderRadiusTop = 80 * (1 - transitionPercent);
        borderRadiusBottom = 0;
    } else if (timePercent > 0.5) {
        borderRadiusTop = 0;
        let transitionPercent = (0.75 - timePercent) / 0.25;
        borderRadiusBottom = 50 * transitionPercent;
    } else if (timePercent > 0.25) {
        borderRadiusTop = 0;
        let transitionPercent = (0.5 - timePercent) / 0.25;
        borderRadiusBottom = 50 + (80 - 50) * transitionPercent;
    } else {
        borderRadiusTop = 0;
        borderRadiusBottom = 80;
    }

    mouth.style.borderRadius = `${borderRadiusTop}% ${borderRadiusTop}% ${borderRadiusBottom}% ${borderRadiusBottom}%`;
}


function startTimer(duration){

    endTime = Date.now() + duration; 

    if (timerInterval){
        clearInterval(timerInterval); 
    }

    timerInterval = setInterval(function() {

        const Now = Date.now(); 
        timeRemaining = endTime - Now;

        if (isTimerReset){
            clearInterval(timerInterval); 
            return; 
        }

        if (timeRemaining <= 0){
            clearInterval(timerInterval) ;
            if (isBreak){
                alert(`Break time is over. Ready to continue studying?`); 
                isBreak = false;
                if (currentCycle < cycleCount){
                    startNextCycle();
                }
                else {
                    alert("All study cycles completed!");
                }
            }
            else { 
                if (currentCycle < cycleCount){
                    alert(`Study time is over. Time for a break!`);
                    isBreak = true; 
                    startTimer(breakTime); 
                }
                else{
                    alert("All study cycles completed!");
                }
            }
            return;
        }

        if (!isTimerPaused) {
            updateTimerDisplay(timeRemaining); 
            updatePomodoroImage(timeRemaining); 
        }
    }, 1000); 
}


function updateTimerDisplay(time) {
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    document.getElementById('timerDisplay').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
