// ============================
// State
// ============================
let startTime = 0;       // timestamp when the current run started
let elapsedTime = 0;      // total accumulated time in ms (across pauses)
let timerInterval = null; // reference to setInterval, so we can stop it
let isRunning = false;
let laps = [];             // array of lap durations in ms

// ============================
// DOM references
// ============================
const timeDisplay = document.getElementById('timeDisplay');
const statusLabel = document.getElementById('statusLabel');
const dial = document.getElementById('dial');
const dialProgress = document.getElementById('dialProgress');
const startPauseBtn = document.getElementById('startPauseBtn');
const lapBtn = document.getElementById('lapBtn');
const resetBtn = document.getElementById('resetBtn');
const lapsList = document.getElementById('lapsList');
const lapsEmpty = document.getElementById('lapsEmpty');
const lapCount = document.getElementById('lapCount');

const CIRCUMFERENCE = 578; // 2 * PI * r(92), matches dasharray in CSS

// ============================
// Helpers
// ============================
function formatTime(ms) {
  const totalCentiseconds = Math.floor(ms / 10);
  const minutes = Math.floor(totalCentiseconds / 6000);
  const seconds = Math.floor((totalCentiseconds % 6000) / 100);
  const centiseconds = totalCentiseconds % 100;

  const pad = (num, size = 2) => String(num).padStart(size, '0');
  return `${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
}

function updateDial(ms) {
  // Progress ring completes one full loop every 60 seconds
  const cycleProgress = (ms % 60000) / 60000;
  const offset = CIRCUMFERENCE - cycleProgress * CIRCUMFERENCE;
  dialProgress.style.strokeDashoffset = offset;
}

function render() {
  const currentElapsed = isRunning ? elapsedTime + (Date.now() - startTime) : elapsedTime;
  timeDisplay.textContent = formatTime(currentElapsed);
  updateDial(currentElapsed);
}

function tick() {
  render();
}

// ============================
// Controls
// ============================
function start() {
  isRunning = true;
  startTime = Date.now();
  timerInterval = setInterval(tick, 30);

  statusLabel.textContent = 'Running';
  dial.classList.add('running');
  dial.classList.remove('paused');

  startPauseBtn.textContent = 'Pause';
  startPauseBtn.classList.add('is-running');
  lapBtn.disabled = false;
  resetBtn.disabled = false;
}

function pause() {
  isRunning = false;
  elapsedTime += Date.now() - startTime;
  clearInterval(timerInterval);

  statusLabel.textContent = 'Paused';
  dial.classList.remove('running');
  dial.classList.add('paused');

  startPauseBtn.textContent = 'Resume';
  startPauseBtn.classList.remove('is-running');
  lapBtn.disabled = true;
}

function reset() {
  isRunning = false;
  clearInterval(timerInterval);
  elapsedTime = 0;
  startTime = 0;
  laps = [];

  statusLabel.textContent = 'Ready';
  dial.classList.remove('running', 'paused');

  startPauseBtn.textContent = 'Start';
  startPauseBtn.classList.remove('is-running');
  lapBtn.disabled = true;
  resetBtn.disabled = true;

  render();
  renderLaps();
}

function recordLap() {
  const currentElapsed = elapsedTime + (Date.now() - startTime);
  const previousTotal = laps.length ? laps[laps.length - 1].total : 0;
  const splitTime = currentElapsed - previousTotal;

  laps.push({ total: currentElapsed, split: splitTime });
  renderLaps();
}

function renderLaps() {
  lapsList.innerHTML = '';

  if (laps.length === 0) {
    lapsList.appendChild(lapsEmpty);
    lapCount.textContent = '0';
    return;
  }

  const splits = laps.map(l => l.split);
  const fastest = Math.min(...splits);
  const slowest = Math.max(...splits);

  laps.forEach((lap, index) => {
    const li = document.createElement('li');

    let splitClass = '';
    if (laps.length > 1) {
      if (lap.split === fastest) splitClass = 'lap-fastest';
      else if (lap.split === slowest) splitClass = 'lap-slowest';
    }

    li.innerHTML = `
      <span class="lap-index">Lap ${index + 1}</span>
      <span class="${splitClass}">${formatTime(lap.split)}</span>
    `;
    lapsList.prepend(li);
  });

  lapCount.textContent = laps.length;
}

// ============================
// Event listeners
// ============================
startPauseBtn.addEventListener('click', () => {
  if (!isRunning) {
    start();
  } else {
    pause();
  }
});

lapBtn.addEventListener('click', recordLap);
resetBtn.addEventListener('click', reset);

// Keyboard shortcuts: Space = start/pause, L = lap, R = reset
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    startPauseBtn.click();
  } else if (e.key.toLowerCase() === 'l' && !lapBtn.disabled) {
    recordLap();
  } else if (e.key.toLowerCase() === 'r' && !resetBtn.disabled) {
    reset();
  }
});

render();
