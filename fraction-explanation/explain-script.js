const canvas = document.getElementById('pizzaCanvasExplain');
const ctx = canvas.getContext('2d');
const denSlider = document.getElementById('denSlider');
const numSlider = document.getElementById('numSlider');
const denValue = document.getElementById('denValue');
const numValue = document.getElementById('numValue');
const dynamicFractionSpan = document.getElementById('dynamicFraction');
const animNumeratorSpan = document.getElementById('animNumerator');
const animDenominatorSpan = document.getElementById('animDenominator');
const liveExplainSpan = document.getElementById('liveExplain');
const animateBtn = document.getElementById('animateBtn');

canvas.width = 260;
canvas.height = 260;

let currentNum = 3;
let currentDen = 4;

function drawPizza(num, den) {
    if (!ctx) return;
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const centerX = w/2, centerY = h/2;
    const radius = w/2 - 6;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 3, 0, Math.PI*2);
    ctx.fillStyle = "#e6bc7e";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI*2);
    ctx.fillStyle = "#ffdd99";
    ctx.fill();
    ctx.strokeStyle = "#b87c3a";
    ctx.lineWidth = 2;
    ctx.stroke();

    if (den === 0) return;
    const angleStep = (Math.PI * 2) / den;
    const startAngleOffset = -Math.PI / 2;

    for (let i = 0; i < den; i++) {
        const start = startAngleOffset + i * angleStep;
        const end = start + angleStep;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, start, end);
        ctx.closePath();

        if (i < num) {
            ctx.fillStyle = "#e68a2e";
            ctx.fill();
            ctx.strokeStyle = "#b85c1a";
            ctx.stroke();
        } else {
            ctx.fillStyle = "#fce3b6";
            ctx.fill();
            ctx.strokeStyle = "#d99e45";
            ctx.stroke();
        }
    }

    ctx.beginPath();
    ctx.arc(centerX - 25, centerY - 20, 6, 0, Math.PI*2);
    ctx.fillStyle = "#fff5e0";
    ctx.fill();
    ctx.fillStyle = "#302010";
    ctx.arc(centerX - 27, centerY - 22, 2, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX + 25, centerY - 20, 6, 0, Math.PI*2);
    ctx.fillStyle = "#fff5e0";
    ctx.fill();
    ctx.fillStyle = "#302010";
    ctx.arc(centerX + 23, centerY - 22, 2, 0, Math.PI*2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX, centerY + 10, 18, 0.05, Math.PI - 0.05);
    ctx.strokeStyle = "#804e2a";
    ctx.lineWidth = 3;
    ctx.stroke();
}

function updateFractionText(num, den) {
    animNumeratorSpan.innerText = num;
    animDenominatorSpan.innerText = den;
    dynamicFractionSpan.innerText = `${num}/${den}`;
    const fractionWord = getFractionWord(num, den);
    liveExplainSpan.innerHTML = `👆 Передвигай ползунки! Пицца покажет, какая часть закрашена.<br>
    <strong>Дробь ${num}/${den} означает: целое разделили на ${den} равных частей и взяли ${num} ${getPartWord(num)}.</strong>
    <br>${fractionWord}`;
}

function getPartWord(num) {
    if (num % 10 === 1 && num !== 11) return "часть";
    if ([2,3,4].includes(num % 10) && !(num > 10 && num < 15)) return "части";
    return "частей";
}

function getFractionWord(num, den) {
    if (num === 1 && den === 2) return " 🍕 Это половина!";
    if (num === 1 && den === 4) return " 🍕 Это одна четверть (четвертинка).";
    if (num === 3 && den === 4) return " 🍕 Три четверти — больше половины!";
    if (num === 1 && den === 3) return " 🍕 Одна треть — примерно треть пиццы.";
    if (num === 2 && den === 3) return " 🍕 Две трети — почти целое!";
    if (num === den) return " 🎉 Взяли все части — это целое!";
    if (num === 0) return " 😲 Ты не взял ни одного кусочка! Дробь равна 0.";
    if (num < den) return " ✅ Это правильная дробь (меньше целого).";
    return " ✨ Отличный выбор!";
}

function syncFromSliders() {
    let newDen = parseInt(denSlider.value);
    let newNum = parseInt(numSlider.value);
    if (newNum > newDen) {
        newNum = newDen;
        numSlider.value = newNum;
    }
    currentNum = newNum;
    currentDen = newDen;
    denValue.innerText = currentDen;
    numValue.innerText = currentNum;
    numSlider.max = currentDen;
    if (currentNum > currentDen) {
        currentNum = currentDen;
        numSlider.value = currentNum;
        numValue.innerText = currentNum;
    }
    drawPizza(currentNum, currentDen);
    updateFractionText(currentNum, currentDen);
}

function animateFraction() {
    let steps = [
        { den: 2, num: 1, delay: 0 },
        { den: 4, num: 2, delay: 700 },
        { den: 4, num: 3, delay: 1400 },
        { den: 8, num: 5, delay: 2100 },
        { den: 8, num: 6, delay: 2800 }
    ];
    let timeouts = [];
    let highestId = setTimeout(()=>{}, 0);
    for(let i = highestId; i > 0; i--) clearTimeout(i);

    steps.forEach(step => {
        const tid = setTimeout(() => {
            denSlider.value = step.den;
            numSlider.max = step.den;
            if(step.num > step.den) step.num = step.den;
            numSlider.value = step.num;
            syncFromSliders();
            const flashDiv = document.createElement('div');
            flashDiv.style.position = 'fixed';
            flashDiv.style.top = '0';
            flashDiv.style.left = '0';
            flashDiv.style.width = '100%';
            flashDiv.style.height = '100%';
            flashDiv.style.backgroundColor = 'rgba(255,215,130,0.3)';
            flashDiv.style.pointerEvents = 'none';
            flashDiv.style.zIndex = '999';
            document.body.appendChild(flashDiv);
            setTimeout(()=> flashDiv.remove(), 200);
        }, step.delay);
        timeouts.push(tid);
    });
    const finalTid = setTimeout(() => {
        liveExplainSpan.innerHTML += "<br>✨ Анимация завершена! Теперь крути ползунки сам ✨";
    }, 3600);
    timeouts.push(finalTid);
    window.currentAnimTimeouts = timeouts;
}

denSlider.addEventListener('input', (e) => {
    currentDen = parseInt(e.target.value);
    denValue.innerText = currentDen;
    numSlider.max = currentDen;
    if (currentNum > currentDen) {
        currentNum = currentDen;
        numSlider.value = currentNum;
        numValue.innerText = currentNum;
    }
    drawPizza(currentNum, currentDen);
    updateFractionText(currentNum, currentDen);
});

numSlider.addEventListener('input', (e) => {
    let val = parseInt(e.target.value);
    if (val > currentDen) val = currentDen;
    currentNum = val;
    numSlider.value = currentNum;
    numValue.innerText = currentNum;
    drawPizza(currentNum, currentDen);
    updateFractionText(currentNum, currentDen);
});

animateBtn.addEventListener('click', () => {
    animateFraction();
});

denSlider.value = 4;
numSlider.value = 3;
numSlider.max = 4;
currentDen = 4;
currentNum = 3;
denValue.innerText = 4;
numValue.innerText = 3;
drawPizza(3, 4);
updateFractionText(3, 4);