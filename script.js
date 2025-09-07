const quizQuestions = [
    {
        question: "What does CSS stand for?",
        options: [
            "Computer Style Sheets",
            "Creative Style System",
            "Cascading Style Sheets",
            "Colorful Style Sheets"
        ],
        correct: 2
    },
    {
        question: "Which HTML tag is used to link a JavaScript file?",
        options: [
            "<script>",
            "<javascript>",
            "<js>",
            "<link>"
        ],
        correct: 0
    },
    {
        question: "Which of these is a JavaScript framework?",
        options: [
            "Django",
            "Flask",
            "React",
            "Ruby on Rails"
        ],
        correct: 2
    },
    {
        question: "What does API stand for?",
        options: [
            "Application Programming Interface",
            "Advanced Programming Interaction",
            "Application Process Integration",
            "Automated Programming Interface"
        ],
        correct: 0
    },
    {
        question: "Which CSS property is used to make a website responsive?",
        options: [
            "display",
            "flex",
            "media queries",
            "position"
        ],
        correct: 2
    }
];

const welcomeScreen = document.getElementById('welcome-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const questionElement = document.getElementById('question');
const questionNumberElement = document.getElementById('question-number');
const optionsContainer = document.getElementById('options-container');
const progressBar = document.getElementById('progress-bar');
const finalScoreElement = document.getElementById('final-score');
const jokeTextElement = document.getElementById('joke-text');
const timerElement = document.getElementById('timer');

let currentQuestion = 0;
let score = 0;
let selectedOption = null;
let timeLeft = 15;
let timer;

function showScreen(screen) {
    welcomeScreen.classList.remove('active');
    quizScreen.classList.remove('active');
    resultsScreen.classList.remove('active');
    screen.classList.add('active');
}

function startTimer() {
    timeLeft = 15;
    timerElement.textContent = `${timeLeft}s`;

    if (timer) clearInterval(timer);

    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            nextQuestion();
        }
    }, 1000);
}

function loadQuestion() {
    const question = quizQuestions[currentQuestion];
    questionElement.textContent = question.question;
    questionNumberElement.textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;

    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.textContent = option;
        optionElement.dataset.index = index;
        optionElement.addEventListener('click', selectOption);
        optionsContainer.appendChild(optionElement);
    });

    progressBar.style.width = `${((currentQuestion + 1) / quizQuestions.length) * 100}%`;

    selectedOption = null;
    nextBtn.disabled = true;

    startTimer();
}

function selectOption(e) {
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
    });

    e.target.classList.add('selected');
    selectedOption = parseInt(e.target.dataset.index);
    nextBtn.disabled = false;

    clearInterval(timer);
}

function nextQuestion() {
    clearInterval(timer);

    if (selectedOption === quizQuestions[currentQuestion].correct) {
        score++;
    }

    currentQuestion++;

    if (currentQuestion < quizQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    finalScoreElement.textContent = `${score}/${quizQuestions.length}`;
    showScreen(resultsScreen);
    fetchJoke();
}

async function fetchJoke() {
    try {
        const response = await fetch('https://official-joke-api.appspot.com/jokes/programming/random');
        const data = await response.json();
        jokeTextElement.textContent = `${data[0].setup} - ${data[0].punchline}`;
    } catch (error) {
        jokeTextElement.textContent = "Why do programmers prefer dark mode? Because light attracts bugs!";
    }
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    loadQuestion();
    showScreen(quizScreen);
}

startBtn.addEventListener('click', () => {
    showScreen(quizScreen);
    loadQuestion();
});

nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', restartQuiz);

showScreen(welcomeScreen);
