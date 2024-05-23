// Define the initial state of the quiz
let state = {
  questionCount: 0, // Current question count
  userSelections: new Array(0), // Array to store user selections
  totalScoresHistory: new Array(questions.length).fill(0), // Array to store scores for each question
  timer: null, // Timer reference
  time: 0, // Elapsed time
  timeouTime: 0, // Timeout time
  mytime: null, // Timer reference
  timeOut: 600, // Timeout duration in seconds
  currentTimeString: null, // Current time string
  passedTime: 0, // Passed time
  sessionPoints: null, // Session points
};

// Timer function to increment time and update the timer display
const myTimer = () => {
  state.time++;
  document.getElementById("timer").innerHTML = state.time;
};

// Function to update the state object
const updateState = (newState, restorePreviousState) => {
  state = { ...state, ...newState };
};

// Function to update the total score based on user selections
const updateScore = () => {
  const totalPoints = state.totalScoresHistory.reduce((sum, points) => sum + points, 0);
  const wrongAnswers = state.userSelections.filter((selection) => selection !== null).length - totalPoints;
  state.sessionPoints = `${totalPoints} correct answers out of ${questions.length} questions in ${state.passedTime} seconds`;
};

// Function to save the user's answer for a question
const saveUserAnswer = (selectedOption, timeout, isPrevious) => {
  const updatedUserSelections = [...state.userSelections];
  const updatedTotalScoresHistory = [...state.totalScoresHistory];

  if (isPrevious) {
    updatedUserSelections[state.questionCount] = null;
    updatedTotalScoresHistory[state.questionCount] = 0;
  } else if (!timeout) {
    const index = selectedOption ? [...selectedOption.parentElement.children].indexOf(selectedOption) : -1;
    const rightAnswerIndex = questions[state.questionCount].options.indexOf(questions[state.questionCount].answer);

    updatedUserSelections[state.questionCount] = index;
    updatedTotalScoresHistory[state.questionCount] = index === rightAnswerIndex ? 1 : 0;
  } else {
    updatedUserSelections[state.questionCount] = -1;
    updatedTotalScoresHistory[state.questionCount] = 0;
  }

  updateState({ userSelections: updatedUserSelections, totalScoresHistory: updatedTotalScoresHistory });
  updateScore();
};

// Function to start the timer
const startTimer = () => {
  clearTimeout(state.timer);
  const timer = setTimeout(() => {
    alert("Time's up! moving to the next question");
    next();
  }, 30000);
  updateState({ timer, time: 0 });
};

// Function to move to the next question
function next() {
  clearTimeout(state.timer);

  const activeOption = document.querySelector("li.option.active");
  if (activeOption) {
    saveUserAnswer(activeOption);
  } else {
    saveUserAnswer(null, true);
  }

  if (state.questionCount === questions.length - 1) {
    sessionStorage.setItem("time", state.time);
    clearInterval(state.mytime);
    final();
  } else {
    updateState({ questionCount: state.questionCount + 1 });  // Increment the question count for the next question
    show(state.questionCount);  // Update the question count before showing the next question
    startTimer();
  }
}

// Function to move to the previous question
function previous() {
  clearTimeout(state.timer);

  if (state.questionCount === 0) {
    alert("This is the first question");
  } else {
    const updatedUserSelections = [...state.userSelections]
    updatedUserSelections[state.questionCount] = null;

    updateState({ questionCount: state.questionCount - 1, userSelections: updatedUserSelections });
    show(state.questionCount);
    startTimer();
    saveUserAnswer(null, false, true);
  }
}

// Function to display the question and options
const show = (count) => {
  const question = document.getElementById("questions");
  const [first, second, third, fourth] = questions[count].options;

  question.innerHTML = `
    <h2>Q${count + 1}. ${questions[count].question}</h2>

  `;
  questions

  const option = document.querySelectorAll("li.option");
  option.forEach((item) => {
    item.classList.remove("active");
    item.style.backgroundColor = "white";
  });

  const activeOptionIndex = state.userSelections[count];
  toggleActive(activeOptionIndex);

  updateScoreDisplay();
  startTimer();
};

// Function to toggle the active option
const toggleActive = (activeOptionIndex) => {
  const option = document.querySelectorAll("li.option");

  option.forEach((item, index) => {
    item.classList.remove("active");
    item.style.backgroundColor = "white";
    if (activeOptionIndex !== null) {
      if (index === activeOptionIndex) {
        item.classList.add("active");
        item.style.backgroundColor = "yellow";
      }
    }

    item.onclick = () => {
      toggleActive(index);
      console.log("Selected option:", item.textContent);
    };
  });
};

// Function to update the score display
const updateScoreDisplay = () => {
  const scoreElement = document.getElementById("score");
  const totalPoints = state.totalScoresHistory.reduce((sum, points) => sum + points, 0);
  const wrongAnswers = state.userSelections.filter((selection) => selection !== null).length - totalPoints;

  scoreElement.innerHTML = `
    <h2>Remaining items : ${questions.length - state.questionCount - 1}</h2>
    <h3> ${totalPoints} correct answers </h3>
    <h3>${wrongAnswers} wrong answer(s)</h3> 
    <button class="btn" onclick="restart()">Play Again</button>
  `;
  state.sessionPoints = `${totalPoints} correct answers out of ${questions.length} questions in ${state.passedTime} seconds`;
};

// Function to restart the quiz
const restart = () => {
  location.href = "main.html";
};

// Function to finalize the quiz and store the results
const final = () => {
  const dataToStore = {
    totalScoresHistory: state.sessionPoints,
  };
  sessionStorage.setItem("quizResults", JSON.stringify(dataToStore));
  location.href = "end.html";
  console.log(dataToStore);
};

// Function to handle the timeout
const timeout = () => {
  setTimeout(() => {
    state.timeouTime++;
    state.passedTime++;

    const remainingTime = state.timeOut - state.timeouTime;
    const minutes = Math.floor(remainingTime / 60).toString().padStart(2, "0");
    const seconds = (remainingTime % 60).toString().padStart(2, "0");
    document.getElementById("timeOutTimer").innerHTML = `Time remaining: ${minutes}:${seconds}`;

    if (state.timeouTime >= state.timeOut) {
      final();
    } else {
      timeout();
    }
  }, 1000);
};

// Function to shuffle an array
const shuffle = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

// Initial setup
const init = () => {
  shuffle(questions);
  show(state.questionCount);
  timeout();
};

window.onload = init;
