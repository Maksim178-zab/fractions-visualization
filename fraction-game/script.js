const QUESTIONS = [
    { num: 1, den: 2, label: "1/2" },
    { num: 1, den: 4, label: "1/4" },
    { num: 3, den: 4, label: "3/4" },
    { num: 2, den: 3, label: "2/3" },
    { num: 1, den: 3, label: "1/3" },
    { num: 2, den: 5, label: "2/5" },
    { num: 3, den: 8, label: "3/8" },
    { num: 5, den: 8, label: "5/8" }
];

function generateOptions(correctNum, correctDen) {
    let candidates = [
        { num: 1, den: 2, label: "1/2" }, { num: 1, den: 3, label: "1/3" }, { num: 2, den: 3, label: "2/3" },
        { num: 1, den: 4, label: "1/4" }, { num: 3, den: 4, label: "3/4" }, { num: 1, den: 5, label: "1/5" },
        { num: 2, den: 5, label: "2/5" }, { num: 3, den: 5, label: "3/5" }, { num: 4, den: 5, label: "4/5" },
        { num: 1, den: 6, label: "1/6" }, { num: 5, den: 6, label: "5/6" }, { num: 3, den: 8, label: "3/8" },
        { num: 5, den: 8, label: "5/8" }, { num: 1, den: 8, label: "1/8" }, { num: 7, den: 8, label: "7/8" },
        { num: 2, den: 7, label: "2/7" }, { num: 4, den: 7, label: "4/7" }
    ];
    const correct = { num: correctNum, den: correctDen, label: `${correctNum}/${correctDen}` };
    let filtered = candidates.filter(c => !(c.num === correctNum && c.den === correctDen));
    for (let i = filtered.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
    }
    let distinctOptions = filtered.slice(0, 3);
    let optionsArray = [...distinctOptions, correct];
    for (let i = optionsArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [optionsArray[i], optionsArray[j]] = [optionsArray[j], optionsArray[i]];
    }
    return optionsArray;
}

let currentQuestionsList = [];
let currentQuestionIndex = 0;
let score = 0;
let waitingForNext = false;
let currentOptionsList = [];
let correctAnswerForCurrent = null;
let answered = false;

const canvas = document.getElementById('pizzaCanvas');
const ctx = canvas.getContext('2d');
const scoreSpan = document.getElementById('scoreDisplay');
const questionIdxSpan = document.getElementById('questionIdxDisplay');
const totalQuestionsSpan = document.getElementById('totalQuestionsSpan');
const optionsContainer = document.getElementById('optionsContainer');
const messageBox = document.getElementById('messageBox');
const nextBtn = document.getElementById('nextQuestionBtn');
const resetBtn = document.getElementById('resetGameBtn');
const fractionHintSpan = document.getElementById('fractionHint');

function drawFractionPizza(num, den) {
    if (!ctx) return;
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    ctx.arc(w/2, h/2, w/2 - 4, 0, Math.PI * 2);
    ctx.fillStyle = "#ffdd99";
    ctx.fill();
    ctx.strokeStyle = "#c07a3a";
    ctx.lineWidth = 3;
    ctx.stroke();
    if (den === 0) return;
    const anglePerPart = (Math.PI * 2) / den;
    const startAngle = -Math.PI / 2;
    for (let i = 0; i < den; i++) {
        const isFilled = i < num;
        ctx.beginPath();
        const angleStart = startAngle + i * anglePerPart;
        const angleEnd = angleStart + anglePerPart;
        ctx.moveTo(w/2, h/2);
        ctx.arc(w/2, h/2, w/2 - 4, angleStart, angleEnd);
        ctx.closePath();
        if (isFilled) {
            ctx.fillStyle = "#e68a2e";
            ctx.fill();
            ctx.strokeStyle = "#b85c1a";
            ctx.lineWidth = 1.5;
            ctx.stroke();
        } else {
            ctx.fillStyle = "#fce3b6";
            ctx.fill();
            ctx.strokeStyle = "#d99e45";
            ctx.stroke();
        }
    }
    ctx.beginPath();
    ctx.arc(w/2, h/2, w/2 - 12, 0, Math.PI*2);
    ctx.fillStyle = "#ffe0a3";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w/2, h/2, w/2 - 4, 0, Math.PI * 2);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#b4682d";
    ctx.stroke();
}

function updateUIStats() {
    scoreSpan.innerText = score;
    questionIdxSpan.innerText = currentQuestionIndex + 1;
    totalQuestionsSpan.innerText = currentQuestionsList.length;
}

function loadCurrentQuestion() {
    if (currentQuestionIndex >= currentQuestionsList.length) {
        messageBox.innerHTML = "🎉 ПОЗДРАВЛЯЕМ! Ты отлично знаешь дроби! 🎉<br> Нажми «Новая игра», чтобы продолжить веселье!";
        nextBtn.disabled = true;
        optionsContainer.innerHTML = '';
        fractionHintSpan.innerText = "🏆";
        drawFractionPizza(0, 1);
        return;
    }
    const q = currentQuestionsList[currentQuestionIndex];
    const num = q.num;
    const den = q.den;
    correctAnswerForCurrent = { num, den };
    currentOptionsList = generateOptions(num, den);
    drawFractionPizza(num, den);
    fractionHintSpan.innerText = "?";
    const questionTextDiv = document.getElementById('questionText');
    questionTextDiv.innerHTML = `🍕 Какая часть пиццы закрашена (оранжевые кусочки)? 🍕`;
    renderOptionsButtons();
    answered = false;
    waitingForNext = false;
    nextBtn.disabled = true;
    messageBox.innerHTML = "🤔 Выбери правильную дробь!";
    updateUIStats();
}

function renderOptionsButtons() {
    optionsContainer.innerHTML = '';
    currentOptionsList.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt.label;
        btn.dataset.num = opt.num;
        btn.dataset.den = opt.den;
        btn.addEventListener('click', () => onAnswerSelected(opt.num, opt.den, btn));
        optionsContainer.appendChild(btn);
    });
}

function onAnswerSelected(selectedNum, selectedDen, btnElement) {
    if (answered || waitingForNext) {
        messageBox.innerHTML = "💡 Уже отвечено! Нажми «Следующий вопрос».";
        return;
    }
    const isCorrect = (selectedNum === correctAnswerForCurrent.num && selectedDen === correctAnswerForCurrent.den);
    if (isCorrect) {
        score += 10;
        updateUIStats();
        messageBox.innerHTML = "✅ ПРАВИЛЬНО! 🎉 +10 очков! Молодец!";
        btnElement.classList.add('correct-feedback');
        disableAllOptions(true);
        answered = true;
        waitingForNext = true;
        nextBtn.disabled = false;
        fractionHintSpan.innerText = `${correctAnswerForCurrent.num}/${correctAnswerForCurrent.den}`;
    } else {
        btnElement.classList.add('wrong-feedback');
        messageBox.innerHTML = `❌ Неправильно! Это ${correctAnswerForCurrent.num}/${correctAnswerForCurrent.den}. Попробуй следующий раз!`;
        fractionHintSpan.innerText = `${correctAnswerForCurrent.num}/${correctAnswerForCurrent.den}`;
        disableAllOptions(true);
        answered = true;
        waitingForNext = true;
        nextBtn.disabled = false;
        highlightCorrectOption();
    }
}

function disableAllOptions(disabled) {
    const btns = document.querySelectorAll('.option-btn');
    btns.forEach(btn => {
        if (disabled) {
            btn.disabled = true;
        } else {
            btn.disabled = false;
            btn.classList.remove('correct-feedback', 'wrong-feedback');
        }
    });
}

function highlightCorrectOption() {
    const btns = document.querySelectorAll('.option-btn');
    for (let btn of btns) {
        let num = parseInt(btn.dataset.num);
        let den = parseInt(btn.dataset.den);
        if (num === correctAnswerForCurrent.num && den === correctAnswerForCurrent.den) {
            btn.classList.add('correct-feedback');
            break;
        }
    }
}

function nextQuestion() {
    if (!waitingForNext && !answered) {
        messageBox.innerHTML = "🔔 Сначала выбери ответ!";
        return;
    }
    if (currentQuestionIndex + 1 < currentQuestionsList.length) {
        currentQuestionIndex++;
        disableAllOptions(false);
        loadCurrentQuestion();
    } else {
        currentQuestionIndex++;
        if (currentQuestionIndex >= currentQuestionsList.length) {
            loadCurrentQuestion();
            messageBox.innerHTML = "🏆 ИГРА ЗАВЕРШЕНА! 🏆 Ты супер! Нажми «Новая игра» чтобы повторить дроби.";
            nextBtn.disabled = true;
            disableAllOptions(true);
            return;
        }
    }
}

function initGame() {
    const shuffledQuestions = [...QUESTIONS];
    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
    }
    currentQuestionsList = shuffledQuestions;
    currentQuestionIndex = 0;
    score = 0;
    answered = false;
    waitingForNext = false;
    updateUIStats();
    disableAllOptions(false);
    loadCurrentQuestion();
    nextBtn.disabled = true;
    messageBox.innerHTML = "👋 Выбери дробь! Смотри на пиццу и кусочки!";
}

resetBtn.addEventListener('click', () => {
    initGame();
});

nextBtn.addEventListener('click', () => {
    nextQuestion();
});

initGame();