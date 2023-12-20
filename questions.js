let question_count = 0;
let userSelections = new Array(0);
let totalScoresHistory = new Array(questions.length).fill(0); // Initialize with 0 scores
let timer;
let time = 0;
let timeouTime = 0;
let mytime = setInterval(myTimer, 1000);
let timeOut = 600;
let currentTimeString


let passedTime = 0;

function timeout() {
    setTimeout(function () {
        timeouTime++;
        passedTime++;

        // Display the remaining time
        let remainingTime = timeOut - timeouTime;
        let minutes = Math.floor(remainingTime / 60).toString().padStart(2, '0');
        let seconds = (remainingTime % 60).toString().padStart(2, '0');
        document.getElementById("timeOutTimer").innerHTML = `Time remaining: ${minutes}:${seconds}`;

        // Check if 10 minutes have passed
        if (timeouTime >= timeOut) {
            final();
        } else {
            // Continue the game
            timeout();
        }
    }, 1000);
}


function next() {
    clearTimeout(timer);

    let activeOption = document.querySelector("li.option.active");
    if (activeOption) {
        saveUserAnswer(activeOption);
    } else {
  saveUserAnswer(null, true);

    }

  if (question_count == questions.length - 1) {
        sessionStorage.setItem("time", time);
        clearInterval(mytime);
        final();
    } else {
        question_count++;
        show(question_count);
        startTimer();
    }
}

function previous() {
    if (question_count > 0) {
        question_count--;
        restorePreviousState(); // Restore the previous state of total scores
        show(question_count);
        startTimer();
    } else {
        // Do nothing if already at the first question
        return;
    }
}

function toggleActive(activeOptionIndex) {
    let option = document.querySelectorAll("li.option");

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
}

function show(count) {
    let question = document.getElementById("questions");
    let [first, second, third, fourth] = questions[count].options;

    question.innerHTML = `
    <h2>Q${count + 1}. ${questions[count].question}</h2>
    <ul class="option_group">
        <li class="option">${first}</li>
        <li class="option">${second}</li>
        <li class="option">${third}</li>
        <li class="option">${fourth}</li>
    </ul>
    `;

    // Remove highlighting when displaying options
    let option = document.querySelectorAll("li.option");
    option.forEach((item) => {
        item.classList.remove("active");
        item.style.backgroundColor = "white";
    });

    let activeOptionIndex = userSelections[count];
    toggleActive(activeOptionIndex);

    updateScoreDisplay();
    startTimer();
}

function saveUserAnswer(selectedOption , timeout) {
    if (!timeout){

    let index = [...selectedOption.parentElement.children].indexOf(selectedOption);
    userSelections[question_count] = index;

    let rightAnswerIndex = questions[question_count].options.indexOf(questions[question_count].answer);
    totalScoresHistory[question_count] = index === rightAnswerIndex ? 1 : 0;

    } else {

        userSelections[question_count] =  -1;
        totalScoresHistory[question_count] = 0;



    }

    updateScoreDisplay();
}

console.log(totalScoresHistory , userSelections);

let sessionPoints;
function updateScoreDisplay() {
    let scoreElement = document.getElementById("score");
    let totalPoints = totalScoresHistory.reduce((sum, points) => sum + points, 0);
    // Calculate the number of wrong answers based on the user selections that are not empty 
    let wrongAnswers = userSelections.filter((selection) => selection !== null).length - totalPoints;

    scoreElement.innerHTML = `
    <h2>Reamaining items : ${questions.length - question_count - 1}</h2>
        <h3> ${totalPoints} correct answers </h3>
        <h3>${wrongAnswers} wrong answer(s)</h3> 
        <button class="btn" onclick="restart()">Play Again</button>
    `;
    sessionPoints = `${totalPoints} correct answers out of ${questions.length} questions in ${passedTime} seconds`;
}

function startTimer() {
    clearTimeout(timer);
    time = 0;
    timer = setTimeout(() => {
        alert("Time's up! moving to next question");
        next();

    }, 30000);
}

function restart() {
    location.href = "main.html";
}

function myTimer() {
    time++;
    document.getElementById("timer").innerHTML = time;
}

function final() {




    // Store the totalScoresHistory and timeTaken in session storage
    const dataToStore = {
        totalScoresHistory : sessionPoints
    };
    sessionStorage.setItem("quizResults", JSON.stringify(dataToStore));
    location.href = "end.html";
    console.log(dataToStore);
}


function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function restorePreviousState() {
    totalScoresHistory[question_count] = 0; // Reset the current question's total score
}

shuffle(questions);

window.onload = function () {
    show(question_count);
    timeout();
};