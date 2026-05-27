const canvas = document.getElementById('numberRayCanvas');
const ctx = canvas.getContext('2d');
const denSlider = document.getElementById('denRaySlider');
const numSlider = document.getElementById('numRaySlider');
const denValue = document.getElementById('denRayValue');
const numValue = document.getElementById('numRayValue');
const rayNumerator = document.getElementById('rayNumerator');
const rayDenominator = document.getElementById('rayDenominator');
const rayDecimal = document.getElementById('rayDecimal');
const rayExplanation = document.getElementById('rayExplanation');
const showPointBtn = document.getElementById('showPointBtn');

const width = 700;
const height = 200;
canvas.width = width;
canvas.height = height;

let currentNum = 3;
let currentDen = 4;

function drawNumberRay(num, den) {
    ctx.clearRect(0, 0, width, height);

    const startX = 60;
    const endX = width - 60;
    const y = height - 60;

    // Основная линия
    ctx.beginPath();
    ctx.moveTo(startX - 10, y);
    ctx.lineTo(endX + 15, y);
    ctx.strokeStyle = '#2c5a7a';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Стрелка
    ctx.beginPath();
    ctx.moveTo(endX + 15, y);
    ctx.lineTo(endX + 5, y - 5);
    ctx.lineTo(endX + 5, y + 5);
    ctx.fillStyle = '#2c5a7a';
    ctx.fill();

    // Точка 0
    ctx.beginPath();
    ctx.arc(startX, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#e67e22';
    ctx.fill();
    ctx.fillStyle = '#2c5a7a';
    ctx.font = 'bold 16px "Segoe UI"';
    ctx.fillText('0', startX - 12, y + 5);

    // Точка 1
    ctx.beginPath();
    ctx.arc(endX, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#e67e22';
    ctx.fill();
    ctx.fillStyle = '#2c5a7a';
    ctx.fillText('1', endX + 5, y + 5);

    // Деления
    const segments = den;
    const step = (endX - startX) / segments;

    for (let i = 0; i <= segments; i++) {
        const x = startX + i * step;
        ctx.beginPath();
        ctx.moveTo(x, y - 8);
        ctx.lineTo(x, y + 8);
        ctx.strokeStyle = '#5a6e7a';
        ctx.lineWidth = 2;
        ctx.stroke();

        if (i > 0 && i < segments) {
            ctx.fillStyle = '#5a6e7a';
            ctx.font = '12px "Segoe UI"';
            const fractionValue = i / segments;
            const label = fractionValue.toFixed(2);
            ctx.fillText(label, x - 12, y - 12);

            ctx.fillStyle = '#888';
            ctx.font = '10px "Segoe UI"';
            ctx.fillText(`${i}/${den}`, x - 15, y + 20);
        }
    }

    // Точка с дробью
    const pointX = startX + (num / den) * (endX - startX);
    if (num <= den && pointX >= startX && pointX <= endX) {
        ctx.beginPath();
        ctx.arc(pointX, y - 15, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#e74c3c';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(pointX, y - 15, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(pointX, y - 15);
        ctx.lineTo(pointX, y);
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#e74c3c';
        ctx.font = 'bold 14px "Segoe UI"';
        ctx.fillText(`${num}/${den}`, pointX - 20, y - 25);
    }
}

function updateRay() {
    currentNum = parseInt(numSlider.value);
    currentDen = parseInt(denSlider.value);

    if (currentNum > currentDen) {
        currentNum = currentDen;
        numSlider.value = currentNum;
    }

    numSlider.max = currentDen;

    denValue.innerText = currentDen;
    numValue.innerText = currentNum;
    rayNumerator.innerText = currentNum;
    rayDenominator.innerText = currentDen;

    const decimal = (currentNum / currentDen).toFixed(3);
    rayDecimal.innerText = decimal;

    rayExplanation.innerHTML = `
        📍 Отрезок от 0 до 1 разделили на <strong>${currentDen}</strong> равных частей.
        Отсчитали <strong>${currentNum}</strong> части → это точка <strong>${currentNum}/${currentDen}</strong> (${decimal}).
        ${currentNum === 0 ? '🧐 Ты в самом начале луча!' : currentNum === currentDen ? '🎉 Это единица!' : '👍 Молодец!'}
    `;

    drawNumberRay(currentNum, currentDen);
}

denSlider.addEventListener('input', () => updateRay());
numSlider.addEventListener('input', () => updateRay());

showPointBtn.addEventListener('click', () => {
    updateRay();
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100%';
    flash.style.height = '100%';
    flash.style.backgroundColor = 'rgba(74,144,226,0.2)';
    flash.style.pointerEvents = 'none';
    flash.style.zIndex = '999';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 300);
});

document.querySelectorAll('.example-ray-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const num = parseInt(btn.dataset.num);
        const den = parseInt(btn.dataset.den);
        denSlider.value = den;
        numSlider.max = den;
        numSlider.value = num;
        updateRay();
    });
});

updateRay();