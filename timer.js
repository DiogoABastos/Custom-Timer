const timer = document.querySelector('.timer');
const tasks = document.querySelector('.tasks');
const repetitions = document.querySelector('.reps');
const reset = document.querySelector('.reset-button');
const workout = document.querySelector('.workout');

let started = false;
let currentTask = 0;
let interval;
let reps = 2;
let workoutTitle = 'Apnea Training';

let currentSeconds = data[currentTask].time;

function display(time) {
  if (time < 10) {
    return '0' + time;
  } else {
    return time;
  }
}

function resetCompletedTasks(data) {
  data.forEach(task => {
    task.completed = false;
  });
}

function displayTimer(seconds) {
  let hours = 0;
  let minutes = 0;

  if (seconds / (60 * 60) >= 1) {
    hours = Math.floor(seconds / (60 * 60));
    seconds = (seconds / (60 * 60) - hours) * 60 * 60;
  }

  if (seconds / 60 >= 1) {
    minutes = Math.floor(seconds / 60);
    seconds = (seconds / 60 - minutes) * 60;
  }

  seconds = Math.round(seconds);

  return `${display(hours)}:${display(minutes)}:${display(seconds)}`;
}

function checkAllCompleted(data) {
  return data.every(task => task.completed === true);
}


function handleTimer() {
  // check if completed
  if (currentSeconds <= 0) {
    data[currentTask].completed = true;
  }

  // if completed, move to next task
  if (data[currentTask].completed) {
    // play transition sound
    playSound('transition');

    // get previous task
    let previousTask = currentTask;

    currentTask = (currentTask + 1) % data.length;
    currentSeconds = data[currentTask].time;

    // ajust time
    currentSeconds += 1;

    // select currentTask
    const current = document.getElementById(`${currentTask}`);
    current.classList.add('currentTask');

    // remove class from previous task
    const previous = document.getElementById(`${previousTask}`);
    previous.classList.remove('currentTask');

    //scroll to that task
    document.querySelector('.currentTask').scrollIntoView({
      behavior: 'smooth'
    });
  }

  // check if all tasks are completed
  if (checkAllCompleted(data)) {
    // decrease reps by 1
    reps -= 1;

    // update repetitions
    repetitions.innerText = `Reps: ${reps}`;

    if (reps <= 0) {
      clearInterval(interval);
      started = false;
      timer.innerText = 'Workout Complete!'
      repetitions.innerText = '';
      displayResetButton();

      // play finished sound
      playSound('finished');
      return;
    } else {
      resetCompletedTasks(data);
    }
  }

  // decrease currentSeconds by 1
  currentSeconds -= 1;

  // display timer
  timer.innerText = displayTimer(currentSeconds);
}

function handleEvent(e) {
  const space = 32;

  if (e.keyCode !== space) {
    return;
  }

  if (!started) {
    started = true;
    hideResetButton();
    interval = setInterval(() => {
      handleTimer();
    }, 1000);
  } else {
    started = false;
    clearInterval(interval);
    displayResetButton();
  }
}

function displayTasks(data) {
  // clear Tasks
  tasks.innerHTML = '';

  data.forEach(task => {
    const html = `<div class="card center-align green ${flagFirstTask(task)} size" id="${task.id}">
                    <div class="card-content">
                      <p>${task.id + 1}. ${task.description}</p>
                    </div>
                  </div>`;

    tasks.insertAdjacentHTML('beforeend', html);
  });
}

function flagFirstTask(task) {
  if (task.id == currentTask) {
    return 'currentTask';
  }
}

function displayReps() {
  if (reps !== 1) {
    repetitions.innerText = `Reps: ${reps}`;
  } else {
    repetitions.innerText = 'Last Rep';
  }
}

function displayTitle() {
  workout.innerText = workoutTitle;
}

function displayResetButton() {
  reset.style.display = 'initial';
}

function hideResetButton() {
  reset.style.display = 'none';
}

function handleReset() {
  if (!started) {
    data.forEach(task => {
      task.completed = false;
    });

    currentTask = 0;
    currentSeconds = data[currentTask].time;
    reps = 2;

    initialSet();

    // hide reset button
    hideResetButton();

    //scroll to that task
    document.querySelector('.currentTask').scrollIntoView({
      behavior: 'smooth'
    });
  }
}

function preventScroll(e) {
  const space = 32;
  // prevent space from scrolling
  if (e.keyCode == space && e.target == document.body) {
    e.preventDefault();
  }
}

function playSound(id) {
  const audio = document.getElementById(id);
  audio.currentTime = 0;
  audio.play();
}

function initialSet() {
  timer.innerText = displayTimer(currentSeconds);
  displayTasks(data);
  displayReps();
  displayTitle();
}

initialSet();

window.addEventListener('keyup', handleEvent);
window.addEventListener('keydown', preventScroll);
reset.addEventListener('click', handleReset);
