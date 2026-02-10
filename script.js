// --- QUESTIONS CONFIGURATION ---
const questions = [
    {
        question: "Who is the most handsome husband in the world?",
        answers: [
            { text: "Ryan Reynolds", correct: false, response: "I wish! Try again." },
            { text: "You are! ❤️", correct: true, response: "Correct! Good answer." }
        ]
    },
    {
        question: "Who makes the best tea/coffee?",
        answers: [
            { text: "Me (The Wife)", correct: true, response: "Obviously! ☕" },
            { text: "You (The Husband)", correct: false, response: "Don't lie to yourself!" }
        ]
    },
    {
        question: "How much do you love me?",
        answers: [
            { text: "A lot", correct: true, response: "I know! ❤️" },
            { text: "To the moon and back", correct: true, response: "Aw, I love you too!" }
        ]
    }
];

// --- CONFIGURATION ---
const startDate = new Date("2025-03-09"); // <--- CHANGE THIS TO YOUR DATE (YYYY-MM-DD)
const loveLetter = "Every second with you is my favorite memory. You are my best friend, my soulmate, and my forever Valentine.";

let currentQuestionIndex = 0;
const introContainer = document.getElementById("intro-container");
const quizContainer = document.getElementById("quiz-container");
const quizQuestion = document.getElementById("quiz-question");
const quizOptions = document.getElementById("quiz-options");
const feedbackMsg = document.getElementById("feedback-msg");
const heartFill = document.getElementById("fill-level");
const proposalContainer = document.getElementById("proposal-container");
const successContainer = document.getElementById("success-container");
const noBtn = document.getElementById("no-btn");
const bgMusic = document.getElementById("bg-music");

// --- UPDATED START QUIZ FUNCTION ---
function startQuiz() {
    const bgMusic = document.getElementById("bg-music");

    // 1. Force play immediately to satisfy iPhone's strict user-gesture requirement
    // This must be the very first thing in the function
    bgMusic.play().then(() => {
        console.log("Music playing on " + navigator.platform);
    }).catch(error => {
        console.warn("Autoplay prevented. Music will attempt to start on next tap.", error);
        
        // Fallback: If it still fails, unlock it on the next screen tap
        document.addEventListener('click', () => {
            bgMusic.play();
        }, { once: true });
    });
    
    // 2. Transition the UI as you did before
    introContainer.style.display = "none";
    quizContainer.style.display = "block";
    loadQuestion();
}

/*
function startQuiz() {
    // 1. Play Music
    bgMusic.play().catch(error => {
        console.log("Music playback failed (user interaction needed).");
    });
    
    // 2. Show Quiz
    introContainer.style.display = "none";
    quizContainer.style.display = "block";
    loadQuestion();
}

// This "unlocks" the audio context on the first tap anywhere for iPhone
document.body.addEventListener('touchstart', function() {
    const audio = document.getElementById("bg-music");
    if (audio.paused) {
        audio.play().pause(); // Briefly play and pause to unlock
    }
}, { once: true });
*/
function loadQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    quizQuestion.innerText = currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerText = answer.text;
        button.classList.add("quiz-option");
        button.addEventListener("click", () => selectAnswer(answer));
        quizOptions.appendChild(button);
    });
}

function resetState() {
    feedbackMsg.innerText = "";
    while (quizOptions.firstChild) {
        quizOptions.removeChild(quizOptions.firstChild);
    }
}

function selectAnswer(answer) {
    if (answer.correct) {
        feedbackMsg.style.color = "#2ecc71";
        feedbackMsg.innerText = answer.response;
        
        let progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        updateHeart(progress);

        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                loadQuestion();
            } else {
                showProposal();
            }
        }, 1000); 
    } else {
        feedbackMsg.style.color = "#e74c3c";
        feedbackMsg.innerText = answer.response;
    }
}

function updateHeart(percentage) {
    heartFill.setAttribute("offset", percentage + "%");
}

function showProposal() {
    quizContainer.style.display = "none";
    proposalContainer.style.display = "block";
}

function handleYesClick() {
    proposalContainer.style.display = "none";
    successContainer.style.display = "block";
    
    triggerConfetti(); // Plays confetti
    startTimer();      // Starts the counter
    typeWriter();      // Starts the text
}

function triggerConfetti() {
    const duration = 3000; // 3 seconds
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#ff4d6d', '#ff8fa3', '#ffffff'] // Pink/White Theme
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#ff4d6d', '#ff8fa3', '#ffffff']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

function moveNoButton() {
    const maxWidth = window.innerWidth - noBtn.offsetWidth;
    const maxHeight = window.innerHeight - noBtn.offsetHeight;
    const randomX = Math.random() * (maxWidth - 20);
    const randomY = Math.random() * (maxHeight - 20);

    noBtn.style.position = "absolute";
    noBtn.style.left = randomX + "px";
    noBtn.style.top = randomY + "px";
}

noBtn.addEventListener('touchstart', function(e) {
    e.preventDefault();
    moveNoButton();
});

// --- TIMER LOGIC ---
function startTimer() {
    setInterval(() => {
        const now = new Date();
        const difference = now - startDate;

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        document.getElementById("time-together").innerText = 
            `${days} Days, ${hours} Hours, ${minutes} Min, ${seconds} Sec`;
    }, 1000);
}

// --- TYPEWRITER LOGIC ---
let i = 0;
function typeWriter() {
    const speed = 50; 
    if (i < loveLetter.length) {
        document.getElementById("typewriter-text").innerHTML += loveLetter.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    }
}