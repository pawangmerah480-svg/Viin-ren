// ==================== STATE GLOBAL ====================
let display = document.getElementById('display');
let exprPreview = document.getElementById('exprPreview');
let currentExpr = '';          // ekspresi yang sedang dibangun
let memory = 0;                // nilai memori
let degreeMode = true;         // true = DEG, false = RAD
let history = [];              // array { expr, result }

// Elemen-elemen yang sering digunakan
const themeToggle = document.getElementById('themeToggle');
const degRadBtn = document.getElementById('degRadToggle');
const tabs = document.querySelectorAll('.tab-btn');
const calcPanel = document.getElementById('calcPanel');
const convertPanel = document.getElementById('convertPanel');
const financePanel = document.getElementById('financePanel');
const toolsPanel = document.getElementById('toolsPanel');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistory');

// ==================== FUNGSI BANTU ====================
function updateDisplay(value) {
    display.value = value || '0';
}

function updateExprPreview() {
    exprPreview.innerText = currentExpr || '';
}

// Menambahkan riwayat
function addHistory(expr, result) {
    history.push({ expr, result: result.toString() });
    if (history.length > 30) history.shift(); // batasi 30
    renderHistory();
}

// Render riwayat
function renderHistory() {
    historyList.innerHTML = '';
    if (history.length === 0) {
        historyList.innerHTML = '<li class="history-placeholder">Belum ada riwayat</li>';
        return;
    }
    history.slice().reverse().forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.expr} = ${item.result}`;
        li.addEventListener('click', () => {
            currentExpr = item.result;
            updateDisplay(item.result);
            updateExprPreview();
        });
        historyList.appendChild(li);
    });
}

// ==================== EVALUASI EKSPRESI AMAN ====================
function safeEvaluate(expr) {
    // Ganti simbol tampilan dengan operator JS
    let processed = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-')
        .replace(/\^/g, '**')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/√\(/g, 'Math.sqrt(')
        .replace(/∛\(/g, 'Math.cbrt(')
        .replace(/mod/g, '%');

    // Fungsi trigonometri & hiperbolik
    const trigFuncs = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh'];
    trigFuncs.forEach(f => {
        const regex = new RegExp(f + '\\(', 'g');
        processed = processed.replace(regex, `Math.${f}(`);
    });

    // Konversi derajat ke radian jika perlu
    if (degreeMode) {
        // Untuk fungsi trigonometri dasar (sin, cos, tan) ubah argumen ke radian
        processed = processed.replace(/Math\.(sin|cos|tan)\(([^)]+)\)/g, (match, func, arg) => {
            return `Math.${func}(${arg} * Math.PI/180)`;
        });
        // Untuk invers, hasil dalam radian diubah ke derajat
        processed = processed.replace(/Math\.(asin|acos|atan)\(([^)]+)\)/g, (match, func, arg) => {
            return `Math.${func}(${arg}) * 180/Math.PI`;
        });
    }

    // Fungsi log (basis 10) dan ln
    processed = processed.replace(/log\(/g, 'Math.log10(');
    processed = processed.replace(/ln\(/g, 'Math.log(');
    // exp, abs
    processed = processed.replace(/exp\(/g, 'Math.exp(');
    processed = processed.replace(/abs\(/g, 'Math.abs(');

    // Faktorial: angka! -> factorial(angka)
    processed = processed.replace(/(\d+)!/g, (_, num) => `factorial(${num})`);

    // Fungsi factorial
    const factorial = (n) => {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let res = 1;
        for (let i = 2; i <= n; i++) res *= i;
        return res;
    };

    // Cek pembagian dengan nol sederhana
    if (processed.includes('/0') || processed.includes('/ 0')) {
        throw new Error('Pembagian dengan nol');
    }

    try {
        const fn = new Function('factorial', 'return ' + processed);
        const result = fn(factorial);
        if (isNaN(result) || !isFinite(result)) throw new Error('Hasil tidak valid');
        return result;
    } catch (e) {
        console.warn('Eval error:', e);
        return 'Error';
    }
}

// ==================== HANDLE TOMBOL KEYPAD ====================
function handleButton(action) {
    if (action === 'C') {
        currentExpr = '';
        updateDisplay('0');
        updateExprPreview();
        return;
    }
    if (action === 'del') {
        currentExpr = currentExpr.slice(0, -1);
        updateDisplay(currentExpr || '0');
        updateExprPreview();
        return;
    }
    if (action === '=') {
        if (!currentExpr.trim()) return;
        const result = safeEvaluate(currentExpr);
        if (result === 'Error') {
            updateDisplay('Error');
            addHistory(currentExpr, 'Error');
            currentExpr = '';
        } else {
            const resStr = Number.isInteger(result) ? result.toString() : result.toFixed(10).replace(/\.?0+$/, '');
            updateDisplay(resStr);
            addHistory(currentExpr, resStr);
            currentExpr = resStr;   // lanjutkan kalkulasi
        }
        updateExprPreview();
        return;
    }
    if (action === '±') {
        if (currentExpr.startsWith('-')) {
            currentExpr = currentExpr.slice(1);
        } else {
            currentExpr = '-' + currentExpr;
        }
        updateDisplay(currentExpr || '0');
        updateExprPreview();
        return;
    }
    if (action === 'degRad') {
        degreeMode = !degreeMode;
        degRadBtn.textContent = degreeMode ? 'DEG' : 'RAD';
        return;
    }

    // Mapping untuk fungsi-fungsi
    const funcMap = {
        'sin': 'sin(', 'cos': 'cos(', 'tan': 'tan(', 'asin': 'asin(', 'acos': 'acos(', 'atan': 'atan(',
        'sinh': 'sinh(', 'cosh': 'cosh(', 'tanh': 'tanh(',
        'log': 'log(', 'ln': 'ln(', 'sqrt': '√(', 'cbrt': '∛(',
        'square': '^2', 'cube': '^3', 'pow': '^', 'fact': '!',
        'pi': 'π', 'e': 'e', 'inv': '1/(', 'abs': 'abs(', 'exp': 'exp(', 'mod': '%',
        '(': '(', ')': ')'
    };
    let token = action;
    if (funcMap[action]) token = funcMap[action];

    // Operator khusus
    if (action === '*') token = '×';
    if (action === '/') token = '÷';
    if (action === '-') token = '−';
    if (action === '+') token = '+';
    if (action === '%') token = '%';
    if (action === '.') token = '.';

    currentExpr += token;
    updateDisplay(currentExpr);
    updateExprPreview();
}

// Pasang event listener ke semua tombol keypad
document.querySelectorAll('.scientific-keypad button').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const action = btn.dataset.action;
        if (action) handleButton(action);
    });
});

// ==================== MEMORY ====================
document.getElementById('mc').addEventListener('click', () => { memory = 0; });
document.getElementById('mr').addEventListener('click', () => {
    currentExpr += memory.toString();
    updateDisplay(currentExpr);
    updateExprPreview();
});
document.getElementById('mPlus').addEventListener('click', () => {
    memory += parseFloat(display.value) || 0;
});
document.getElementById('mMinus').addEventListener('click', () => {
    memory -= parseFloat(display.value) || 0;
});

// ==================== TAB SWITCHING ====================
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        calcPanel.classList.toggle('active-panel', target === 'calc');
        convertPanel.classList.toggle('active-panel', target === 'convert');
        financePanel.classList.toggle('active-panel', target === 'finance');
        toolsPanel.classList.toggle('active-panel', target === 'tools');
    });
});

// ==================== DARK MODE ====================
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    themeToggle.innerHTML = document.body.classList.contains('dark') ? '☀️ Terang' : '🌙 Gelap';
});

// ==================== KEYBOARD SUPPORT ====================
window.addEventListener('keydown', (e) => {
    const key = e.key;
    if (key >= '0' && key <= '9') handleButton(key);
    else if (key === '.') handleButton('.');
    else if (key === '+') handleButton('+');
    else if (key === '-') handleButton('-');
    else if (key === '*') handleButton('*');
    else if (key === '/') handleButton('/');
    else if (key === 'Enter' || key === '=') handleButton('=');
    else if (key === 'Escape') handleButton('C');
    else if (key === 'Backspace') handleButton('del');
    else if (key === '%') handleButton('%');
    else if (key === '(') handleButton('(');
    else if (key === ')') handleButton(')');
    // sengaja tidak semua agar tidak terlalu kompleks
});

// ==================== KONVERSI SATUAN ====================
document.getElementById('convertLength').addEventListener('click', () => {
    const val = parseFloat(document.getElementById('lengthIn').value) || 0;
    const from = document.getElementById('lengthFrom').value;
    const to = document.getElementById('lengthTo').value;
    const units = { mm: 0.001, cm: 0.01, m: 1, km: 1000 };
    const result = val * units[from] / units[to];
    document.getElementById('lengthOut').value = result.toFixed(6);
});
document.getElementById('convertWeight').addEventListener('click', () => {
    const val = parseFloat(document.getElementById('weightIn').value) || 0;
    const from = document.getElementById('weightFrom').value;
    const to = document.getElementById('weightTo').value;
    const units = { mg: 0.000001, g: 0.001, kg: 1, ton: 1000 };
    const result = val * units[from] / units[to];
    document.getElementById('weightOut').value = result.toFixed(6);
});
document.getElementById('convertTemp').addEventListener('click', () => {
    let val = parseFloat(document.getElementById('tempIn').value) || 0;
    const from = document.getElementById('tempFrom').value;
    const to = document.getElementById('tempTo').value;
    // konversi ke Celsius
    if (from === 'F') val = (val - 32) * 5/9;
    else if (from === 'K') val = val - 273.15;
    // dari C ke tujuan
    let result;
    if (to === 'C') result = val;
    else if (to === 'F') result = val * 9/5 + 32;
    else if (to === 'K') result = val + 273.15;
    document.getElementById('tempOut').value = result.toFixed(2);
});
document.getElementById('convertTime').addEventListener('click', () => {
    const val = parseFloat(document.getElementById('timeIn').value) || 0;
    const from = document.getElementById('timeFrom').value;
    const to = document.getElementById('timeTo').value;
    const sec = { s:1, min:60, h:3600, d:86400 };
    const result = val * sec[from] / sec[to];
    document.getElementById('timeOut').value = result.toFixed(6);
});
document.getElementById('convertSpeed').addEventListener('click', () => {
    const val = parseFloat(document.getElementById('speedIn').value) || 0;
    const from = document.getElementById('speedFrom').value;
    const to = document.getElementById('speedTo').value;
    const factor = { kmh: 0.277778, ms: 1 };
    const inMS = val * (from === 'kmh' ? 0.277778 : 1);
    const result = inMS / (to === 'kmh' ? 0.277778 : 1);
    document.getElementById('speedOut').value = result.toFixed(4);
});
document.getElementById('convertData').addEventListener('click', () => {
    const val = parseFloat(document.getElementById('dataIn').value) || 0;
    const from = document.getElementById('dataFrom').value;
    const to = document.getElementById('dataTo').value;
    const units = { B:1, KB:1024, MB:1048576, GB:1073741824, TB:1099511627776 };
    const result = val * units[from] / units[to];
    document.getElementById('dataOut').value = result.toFixed(6);
});

// ==================== KEUANGAN ====================
document.getElementById('calcDiscount').addEventListener('click', () => {
    const price = parseFloat(document.getElementById('discountPrice').value) || 0;
    const disc = parseFloat(document.getElementById('discountPercent').value) || 0;
    const final = price - (price * disc / 100);
    document.getElementById('discountResult').innerText = final.toFixed(2);
});
document.getElementById('calcTax').addEventListener('click', () => {
    const amt = parseFloat(document.getElementById('taxAmount').value) || 0;
    const tax = parseFloat(document.getElementById('taxRate').value) || 0;
    const total = amt + (amt * tax / 100);
    document.getElementById('taxResult').innerText = total.toFixed(2);
});
document.getElementById('calcProfit').addEventListener('click', () => {
    const cost = parseFloat(document.getElementById('profitCost').value) || 0;
    const sell = parseFloat(document.getElementById('profitSell').value) || 0;
    if (cost === 0) return;
    const percent = ((sell - cost) / cost) * 100;
    document.getElementById('profitResult').innerText = percent.toFixed(2) + '%';
});
document.getElementById('calcSimple').addEventListener('click', () => {
    const p = parseFloat(document.getElementById('simplePrincipal').value) || 0;
    const r = parseFloat(document.getElementById('simpleRate').value) || 0;
    const t = parseFloat(document.getElementById('simpleTime').value) || 0;
    const interest = p * r / 100 * t;
    document.getElementById('simpleResult').innerText = interest.toFixed(2);
});
document.getElementById('calcSplit').addEventListener('click', () => {
    const total = parseFloat(document.getElementById('billTotal').value) || 0;
    const people = parseFloat(document.getElementById('billPeople').value) || 1;
    const tipPercent = parseFloat(document.getElementById('billTip').value) || 0;
    if (people === 0) return;
    const tipAmount = total * tipPercent / 100;
    const perPerson = (total + tipAmount) / people;
    document.getElementById('splitResult').innerText = perPerson.toFixed(2);
});
document.getElementById('calcLoan').addEventListener('click', () => {
    const principal = parseFloat(document.getElementById('loanAmount').value) || 0;
    const annualRate = parseFloat(document.getElementById('loanRate').value) || 0;
    const years = parseFloat(document.getElementById('loanYears').value) || 1;
    const monthlyRate = annualRate / 100 / 12;
    const months = years * 12;
    if (monthlyRate === 0) {
        document.getElementById('loanResult').innerText = (principal / months).toFixed(2);
    } else {
        const payment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
        document.getElementById('loanResult').innerText = payment.toFixed(2);
    }
});

// ==================== TOOLS ====================
document.getElementById('calcAge').addEventListener('click', () => {
    const birth = new Date(document.getElementById('birthDate').value);
    if (isNaN(birth)) return;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    document.getElementById('ageResult').innerText = age + ' tahun';
});
document.getElementById('calcBmi').addEventListener('click', () => {
    const weight = parseFloat(document.getElementById('weightKg').value) || 0;
    const height = parseFloat(document.getElementById('heightCm').value) || 0;
    if (height === 0) return;
    const bmi = weight / ((height/100) ** 2);
    let category = '';
    if (bmi < 18.5) category = 'Kurus';
    else if (bmi < 25) category = 'Normal';
    else if (bmi < 30) category = 'Gemuk';
    else category = 'Obesitas';
    document.getElementById('bmiResult').innerText = bmi.toFixed(1) + ' (' + category + ')';
});
document.getElementById('calcChange').addEventListener('click', () => {
    const oldVal = parseFloat(document.getElementById('oldVal').value) || 0;
    const newVal = parseFloat(document.getElementById('newVal').value) || 0;
    if (oldVal === 0) return;
    const change = ((newVal - oldVal) / oldVal) * 100;
    const status = change >= 0 ? 'Naik' : 'Turun';
    document.getElementById('changeResult').innerText = change.toFixed(2) + '% (' + status + ')';
});
// Kurs mata uang tetap (contoh)
const rates = {
    IDR: 1, USD: 0.000064, EUR: 0.000059, GBP: 0.000051, SGD: 0.000086, MYR: 0.00028
};
document.getElementById('convertCurrency').addEventListener('click', () => {
    const amt = parseFloat(document.getElementById('currencyAmt').value) || 0;
    const from = document.getElementById('currencyFrom').value;
    const to = document.getElementById('currencyTo').value;
    const inIDR = amt / rates[from];  // konversi ke IDR dulu (karena rates berdasarkan IDR)
    const result = inIDR * rates[to];
    document.getElementById('currencyResult').innerText = result.toFixed(2) + ' ' + to;
});
document.getElementById('calcPercentage').addEventListener('click', () => {
    const x = parseFloat(document.getElementById('percX').value) || 0;
    const y = parseFloat(document.getElementById('percY').value) || 1;
    if (y === 0) return;
    const perc = (x / y) * 100;
    document.getElementById('percResult').innerText = perc.toFixed(2) + '%';
});
document.getElementById('calcPartPercentage').addEventListener('click', () => {
    const part = parseFloat(document.getElementById('percPart').value) || 0;
    const whole = parseFloat(document.getElementById('percWhole').value) || 1;
    if (whole === 0) return;
    const perc = (part / whole) * 100;
    document.getElementById('partPercResult').innerText = perc.toFixed(2) + '%';
});

// ==================== RIWAYAT ====================
clearHistoryBtn.addEventListener('click', () => {
    history = [];
    renderHistory();
});

// Inisialisasi tampilan
updateDisplay('0');
renderHistory();