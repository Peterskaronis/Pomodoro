const timer = document.getElementById('timer');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const workButton = document.getElementById('work');
const breakButton = document.getElementById('break');

const workTime = 25 * 60; // 25 minutes in seconds
const breakTime = 5 * 60;  // 5 minutes in seconds
let timeLeft = workTime;
let isRunning = false;
let interval;

const quotes = {
    work: [],
    break: []
};

const quoteElement = document.getElementById('quote');

const taskModal = document.getElementById('taskModal');
const taskInput = document.getElementById('taskInput');
const submitTask = document.getElementById('submitTask');
let currentTask = '';

const minutes = document.getElementById('minutes');
const seconds = document.getElementById('seconds');

const lofiAudio = document.getElementById('lofi');
const alarmAudio = document.getElementById('alarm');
const toggleMusicBtn = document.getElementById('toggleMusic');
const volumeSlider = document.getElementById('volumeSlider');
const musicText = toggleMusicBtn.querySelector('.music-text');

const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
let isDarkTheme = false;

const circle = document.querySelector('.progress-ring__circle');
const radius = circle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;

function setProgress(percent) {
    const offset = circumference - (percent / 100 * circumference);
    circle.style.strokeDashoffset = offset;
}

function updateTitle(timeString) {
    const taskPrefix = currentTask ? `${currentTask} - ` : '';
    document.title = `${taskPrefix}${timeString} - Focus Time`;
}

function updateTimer() {
    const minutesValue = Math.floor(timeLeft / 60);
    const secondsValue = timeLeft % 60;
    minutes.textContent = minutesValue.toString().padStart(2, '0');
    seconds.textContent = secondsValue.toString().padStart(2, '0');
    const timeString = `${minutesValue.toString().padStart(2, '0')}:${secondsValue.toString().padStart(2, '0')}`;
    updateTitle(timeString);

    const totalTime = workButton.classList.contains('active') ? workTime : breakTime;
    const progress = ((totalTime - timeLeft) / totalTime) * 100;
    setProgress(progress);
}

startButton.addEventListener('click', () => {
    if (isRunning) {
        clearInterval(interval);
        startButton.textContent = 'Resume';
        isRunning = false;
        lofiAudio.pause();
        musicText.textContent = 'Play Music';
    } else {
        if (timeLeft === workTime) {
            taskModal.style.display = 'block';
        } else {
            startTimer();
        }
    }
});

submitTask.addEventListener('click', () => {
    currentTask = taskInput.value.trim();
    taskModal.style.display = 'none';
    taskInput.value = '';
    startTimer();
});

resetButton.addEventListener('click', () => {
    clearInterval(interval);
    isRunning = false;
    timeLeft = workTime;
    minutes.textContent = '25';
    seconds.textContent = '00';
    startButton.textContent = 'Start';
    currentTask = '';
    updateTitle('25:00');
    resetProgress();
    lofiAudio.pause();
    toggleMusicBtn.querySelector('.music-icon').textContent = '▶️';
});

workButton.addEventListener('click', () => {
    clearInterval(interval);
    isRunning = false;
    timeLeft = workTime;
    minutes.textContent = '25';
    seconds.textContent = '00';
    startButton.textContent = 'Start';
    workButton.classList.add('active');
    breakButton.classList.remove('active');
    currentTask = '';
    updateTitle('25:00');
    updateQuote('work');
});

breakButton.addEventListener('click', () => {
    clearInterval(interval);
    isRunning = false;
    timeLeft = breakTime;
    minutes.textContent = '05';
    seconds.textContent = '00';
    startButton.textContent = 'Start';
    breakButton.classList.add('active');
    workButton.classList.remove('active');
    currentTask = '';
    updateTitle('05:00');
    updateQuote('break');
});

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        submitTask.click();
    }
});

window.addEventListener('click', (e) => {
    if (e.target === taskModal) {
        taskModal.style.display = 'none';
        if (!isRunning) {
            startButton.textContent = 'Start';
        }
    }
});

function startTimer() {
    isRunning = true;
    startButton.textContent = 'Pause';
    if (lofiAudio.paused) {
        lofiAudio.play();
        toggleMusicBtn.querySelector('.music-icon').textContent = '⏸️';
    }
    interval = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft === 0) {
            clearInterval(interval);
            alarmAudio.play();
            isRunning = false;
            startButton.textContent = 'Start';
            lofiAudio.pause();
            toggleMusicBtn.querySelector('.music-icon').textContent = '▶️';
            alert('Time is up!');
        }
    }, 1000);
}

async function fetchQuotes() {
    try {
        const response = await fetch('quotes.json');
        if (!response.ok) {
            throw new Error('Failed to load quotes');
        }
        const data = await response.json();
        quotes.work = data.work;
        quotes.break = data.break;
        updateQuote('work');
    } catch (error) {
        console.error('Error loading quotes:', error);
        // Fallback quotes if the file fails to load
        quotes.work = [
            "The only way to make sense out of change is to plunge into it, move with it, and join the dance.",
            "This is the real secret of life – to be completely engaged with what you are doing in the here and now."
        ];
        quotes.break = [
            "Muddy water is best cleared by leaving it alone.",
            "Life is not a problem to be solved, but an experience to be had."
        ];
        updateQuote('work');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Restore theme preference
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme === 'true') {
        toggleTheme();
    } else {
        // Set initial icon for light mode
        themeIcon.textContent = '🌙';
    }
    
    // Your existing DOMContentLoaded code...
    fetchQuotes();
});

function updateQuote(mode) {
    if (!quotes[mode] || quotes[mode].length === 0) {
        quoteElement.textContent = "Loading quotes...";
        return;
    }
    const quoteList = quotes[mode];
    const randomIndex = Math.floor(Math.random() * quoteList.length);
    quoteElement.textContent = quoteList[randomIndex];
}

toggleMusicBtn.addEventListener('click', () => {
    if (lofiAudio.paused) {
        lofiAudio.play();
        toggleMusicBtn.querySelector('.music-icon').textContent = '⏸️';
    } else {
        lofiAudio.pause();
        toggleMusicBtn.querySelector('.music-icon').textContent = '▶️';
    }
});

volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value / 100;
    lofiAudio.volume = volume;
    alarmAudio.volume = volume;
});

function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    document.body.classList.toggle('dark-theme');
    // Reverse the icons: sun for dark mode, moon for light mode
    themeIcon.textContent = isDarkTheme ? '☀️' : '🌙';
    
    // Save preference
    localStorage.setItem('darkTheme', isDarkTheme);
}

themeToggle.addEventListener('click', toggleTheme);

function resetProgress() {
    setProgress(0);
} 