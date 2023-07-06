// Quiz application with completely random questions
// uses a health bar that reduces when you get a question wrong.
// Easy questions: -3 health
// Medium questions: -2 health
// Hard questions: -1 health

// MOM LOOK ITS VARIABLE DECLARATIONS IM A POGRAMMER
const startButton = document.getElementById("start-game")
const answerButtons = document.querySelectorAll("#answer")
const question = document.getElementById("question")
const scoreDisplay = document.getElementById("score")
const difficultyDisplay = document.getElementById("difficulty")

let health = 10
let score = 0

// I ended up making a buffer for the questions so it loads smoothly
let currentQuestionInfo = 0
let nextQuestionInfo = 0

/**
 * Retrieves a question from the Open Trivia API and 
 */
function getQuestion() {
    fetch ("https://opentdb.com/api.php?amount=1&type=multiple&encode=base64").then(response => {
        response.json().then(json => {
            nextQuestionInfo = json.results[0]
        })
    })
}

/**
 * Updates the elements of the page and sets the question
 */
function updateDisplay() {
    currentQuestionInfo = nextQuestionInfo
    scoreDisplay.innerHTML = score
    difficultyDisplay.innerHTML = atob(currentQuestionInfo.difficulty)
    question.innerHTML = atob(currentQuestionInfo.question)
    answers = currentQuestionInfo.incorrect_answers
    answers.push(currentQuestionInfo.correct_answer)

    // Fisher–Yates shuffle Algorithm (I DID NOT WRITE THIS)
    for (let i = answers.length - 1; i > 0; i--)
    {
        let j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
    }

    answerButtons.forEach((button, i) => {
        button.innerHTML = atob(answers[i]);
    })
    getQuestion()
}

/**
 * Sets the health variable to the number given as well as updates the health bar element
 * @param {number} newHealth 
 */
function setHealthBar(newHealth) {
    health = newHealth
    document.querySelector(".health-bar-fill").style.width = `${health * 10}%`;
}

// Itterates though each button to create an on click event
answerButtons.forEach(button => {
    button.addEventListener('click', button => {
        console.log(atob(currentQuestionInfo.correct_answer))
        if (button.target.textContent == atob(currentQuestionInfo.correct_answer)) {
            score++
            updateDisplay()
            return
        }
        switch (atob(currentQuestionInfo.difficulty)) {
            case "easy":
                setHealthBar(health - 3)
                break
            case "medium":
                setHealthBar(health - 2)
                break
            case "hard":
                setHealthBar(health - 1)
                break
        }
        if (health <= 0) {
            document.getElementById("info").style.visibility = "visible"
        }
        updateDisplay()
    })
})

getQuestion()
startButton.onclick = () => {
    score = 0
    setHealthBar(10)
    updateDisplay()
    document.getElementById("info").style.visibility = "hidden"
}