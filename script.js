let minutes = 25;
let seconds = 0;
let isRunning = false;
let timer;

const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const workButton = document.getElementById('work');
const breakButton = document.getElementById('break');

function updateTimer() {
    if (seconds === 0) {
        if (minutes === 0) {
            clearInterval(timer);
            isRunning = false;
            startButton.textContent = 'Start';
            return;
        }
        minutes--;
        seconds = 59;
    } else {
        seconds--;
    }

    // Format the time for display
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    
    // Update the display
    document.getElementById('minutes').textContent = formattedMinutes;
    document.getElementById('seconds').textContent = formattedSeconds;
    
    // Update the tab title
    document.title = `(${formattedMinutes}:${formattedSeconds}) Focus Time`;
}

startButton.addEventListener('click', () => {
    if (!isRunning) {
        isRunning = true;
        startButton.textContent = 'Pause';
        timer = setInterval(updateTimer, 1000);
    } else {
        isRunning = false;
        startButton.textContent = 'Start';
        clearInterval(timer);
    }
});

resetButton.addEventListener('click', () => {
    clearInterval(timer);
    isRunning = false;
    minutes = 25;
    seconds = 0;
    document.getElementById('minutes').textContent = '25';
    document.getElementById('seconds').textContent = '00';
    startButton.textContent = 'Start';
    document.title = '(25:00) Focus Time';
});

workButton.addEventListener('click', () => {
    clearInterval(timer);
    isRunning = false;
    minutes = 25;
    seconds = 0;
    document.getElementById('minutes').textContent = '25';
    document.getElementById('seconds').textContent = '00';
    startButton.textContent = 'Start';
    workButton.classList.add('active');
    breakButton.classList.remove('active');
    document.title = '(25:00) Focus Time';
});

breakButton.addEventListener('click', () => {
    clearInterval(timer);
    isRunning = false;
    minutes = 5;
    seconds = 0;
    document.getElementById('minutes').textContent = '05';
    document.getElementById('seconds').textContent = '00';
    startButton.textContent = 'Start';
    breakButton.classList.add('active');
    workButton.classList.remove('active');
    document.title = '(05:00) Focus Time';
}); 