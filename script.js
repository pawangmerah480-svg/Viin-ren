// ==================== MODULAR TRADING TERMINAL ====================

// ---------- Global State ----------
let marketData = [];
let positions = [];
let chartCanvas = document.getElementById('mainChart');
let ctx = chartCanvas.getContext('2d');
let activeSymbol = 'EURUSD';
let attemptCount = 0; // untuk simulasi psikologi

// ---------- Market Data Simulation ----------
const symbols = [
    { symbol: 'EURUSD', bid: 1.09234, ask: 1.09245, spread: 1.1, change: 0.12 },
    { symbol: 'GBPUSD', bid: 1.26789, ask: 1.26802, spread: 1.3, change: -0.05 },
    { symbol: 'BTCUSD', bid: 62345.6, ask: 62389.2, spread: 43.6, change: 2.34 },
    { symbol: 'AAPL', bid: 175.32, ask: 175.45, spread: 0.13, change: -0.22 },
    { symbol: 'TSLA', bid: 198.76, ask: 199.10, spread: 0.34, change: 1.45 },
    { symbol: 'XAUUSD', bid: 2025.3, ask: 2026.1, spread: 0.8, change: 0.32 },
    { symbol: 'US30', bid: 38945, ask: 38970, spread: 25, change: 0.18 }
];

function updateMarketData() {
    // Simulasi perubahan harga kecil
    marketData = symbols.map(s => {
        let newBid = s.bid + (Math.random() - 0.5) * 0.002 * s.bid;
        let newAsk = newBid + (s.ask - s.bid);
        return {
            ...s,
            bid: newBid,
            ask: newAsk,
            spread: ((newAsk - newBid) / newBid * 10000).toFixed(1),
            change: ((newBid / s.bid - 1) * 100).toFixed(2)
        };
    });
    renderMarketWatch();
    drawChart(); // update chart setiap tick
}

function renderMarketWatch() {
    const tbody = document.querySelector('#marketData');
    const filter = document.getElementById('marketFilter')?.value.toLowerCase() || '';
    const filtered = marketData.filter(s => s.symbol.toLowerCase().includes(filter));
    tbody.innerHTML = filtered.map(s => `
        <tr>
            <td>${s.symbol}</td>
            <td>${s.bid.toFixed(s.symbol.includes('BTC')?1:5)}</td>
            <td>${s.ask.toFixed(s.symbol.includes('BTC')?1:5)}</td>
            <td>${s.spread}</td>
            <td style="color: ${s.change>0?'#4caf50':'#f44336'}">${s.change}%</td>
        </tr>
    `).join('');
}

// Filter market watch
document.getElementById('marketFilter')?.addEventListener('input', renderMarketWatch);

// ---------- Chart Drawing (sederhana) ----------
function drawChart() {
    if (!ctx) return;
    const width = chartCanvas.width;
    const height = chartCanvas.height;
    ctx.clearRect(0, 0, width, height);

    // Latar
    ctx.fillStyle = '#0f141c';
    ctx.fillRect(0, 0, width, height);

    // Simulasi candlestick sederhana (garis)
    ctx.strokeStyle = '#5d9bff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    let data = [];
    for (let i = 0; i < 50; i++) {
        data.push(1.09 + Math.sin(i * 0.3) * 0.01 + (Math.random() * 0.002));
    }
    ctx.moveTo(0, height/2);
    for (let i = 0; i < data.length; i++) {
        let x = i * (width / data.length);
        let y = height/2 - (data[i] - 1.09) * 5000;
        ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Grid
    ctx.strokeStyle = '#2a2f3a';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * height/5);
        ctx.lineTo(width, i * height/5);
        ctx.stroke();
    }
}

// Resize chart canvas saat panel diresize
function resizeChart() {
    const container = document.querySelector('.chart-container');
    if (container && chartCanvas) {
        chartCanvas.width = container.clientWidth;
        chartCanvas.height = container.clientHeight - 4;
        drawChart();
    }
}
window.addEventListener('resize', resizeChart);
new ResizeObserver(resizeChart).observe(document.querySelector('.chart-container'));

// ---------- Order Entry ----------
document.getElementById('btnBuy')?.addEventListener('click', () => {
    attemptCount++;
    simulateOrder('buy');
});
document.getElementById('btnSell')?.addEventListener('click', () => {
    attemptCount++;
    simulateOrder('sell');
});

function simulateOrder(type) {
    const symbol = document.getElementById('symbol').value;
    const volume = parseFloat(document.getElementById('volume').value);
    const price = marketData.find(s => s.symbol === symbol)?.bid || 1.0;
    const sl = parseFloat(document.getElementById('sl').value) || null;
    const tp = parseFloat(document.getElementById('tp').value) || null;
    const comment = document.getElementById('comment').value;

    // Hitung margin (simulasi)
    const margin = volume * 100000 * 0.01; // 1:100 leverage
    document.getElementById('marginReq').innerText = '$' + margin.toFixed(2);
    document.getElementById('riskPercent').innerText = ((margin / 100000) * 100).toFixed(2) + '%';

    // Tambah ke posisi terbuka
    const pos = {
        symbol,
        type: type.toUpperCase(),
        volume,
        open: price.toFixed(5),
        sl: sl ? sl.toFixed(5) : '-',
        tp: tp ? tp.toFixed(5) : '-',
        price: price.toFixed(5),
        pl: (Math.random() * 10 - 5).toFixed(2)
    };
    positions.push(pos);
    renderOpenPositions();

    // Simulasi psychology: jika overtrade (>10x) kasih warning
    if (attemptCount > 10) {
        alert('Warning: Overtrading detected! Discipline lock engaged.');
    }
}

function renderOpenPositions() {
    const tbody = document.querySelector('#openPositions');
    tbody.innerHTML = positions.map(p => `
        <tr>
            <td>${p.symbol}</td>
            <td>${p.type}</td>
            <td>${p.volume}</td>
            <td>${p.open}</td>
            <td>${p.sl}</td>
            <td>${p.tp}</td>
            <td>${p.price}</td>
            <td style="color: ${p.pl>0?'#4caf50':'#f44336'}">${p.pl}</td>
        </tr>
    `).join('');
}

// ---------- Panel Resizing (sederhana) ----------
let isResizing = false;
let currentResizeHandle = null;
let startX, startY, startWidths;

document.querySelectorAll('.resize-handle').forEach(handle => {
    handle.addEventListener('mousedown', initResize);
});

function initResize(e) {
    e.preventDefault();
    isResizing = true;
    currentResizeHandle = e.target;
    startX = e.clientX;
    startY = e.clientY;

    const panel = currentResizeHandle.parentElement;
    if (currentResizeHandle.classList.contains('resize-left')) {
        // resize left panel width
        startWidths = {
            left: panel.offsetWidth,
            center: document.querySelector('.center-panel').offsetWidth,
            right: document.querySelector('.right-panel').offsetWidth
        };
    }
    // ... logika serupa untuk handle lain (disederhanakan)
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
}

function resize(e) {
    if (!isResizing) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    // Implementasi sederhana: ubah grid template columns
    const workspace = document.querySelector('.workspace');
    if (currentResizeHandle.classList.contains('resize-left')) {
        let leftWidth = Math.max(150, startWidths.left + dx);
        let rightWidth = startWidths.right;
        let centerWidth = `1fr`;
        workspace.style.gridTemplateColumns = `${leftWidth}px ${centerWidth} ${rightWidth}px`;
    }
    // ... lainnya
}

function stopResize() {
    isResizing = false;
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
    resizeChart();
}

// ---------- Tab Switching ----------
document.querySelectorAll('.terminal-tabs .tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.terminal-tabs .tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.textContent.trim().toLowerCase();
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        if (target === 'trade') document.getElementById('tradeTab').classList.add('active');
        if (target === 'history') document.getElementById('historyTab').classList.add('active');
        if (target === 'journal') document.getElementById('journalTab').classList.add('active');
    });
});

// ---------- Timeframe Switch ----------
document.querySelectorAll('.timeframe-bar .tf').forEach(tf => {
    tf.addEventListener('click', () => {
        document.querySelectorAll('.timeframe-bar .tf').forEach(t => t.classList.remove('active'));
        tf.classList.add('active');
        drawChart(); // refresh chart (simulasi)
    });
});

// ---------- Save/Load Layout (localStorage) ----------
document.getElementById('saveLayout').addEventListener('click', () => {
    const layout = {
        columns: document.querySelector('.workspace').style.gridTemplateColumns,
        rows: document.querySelector('.workspace').style.gridTemplateRows
    };
    localStorage.setItem('terminalLayout', JSON.stringify(layout));
    alert('Layout saved!');
});

document.getElementById('resetLayout').addEventListener('click', () => {
    document.querySelector('.workspace').style.gridTemplateColumns = '240px 1fr 280px';
    document.querySelector('.workspace').style.gridTemplateRows = '1fr 200px';
    localStorage.removeItem('terminalLayout');
    resizeChart();
});

// Load saved layout
const saved = localStorage.getItem('terminalLayout');
if (saved) {
    try {
        const layout = JSON.parse(saved);
        document.querySelector('.workspace').style.gridTemplateColumns = layout.columns;
        document.querySelector('.workspace').style.gridTemplateRows = layout.rows;
    } catch (e) {}
}

// ---------- Floating Panels (drag) ----------
let dragPanel = null;
document.querySelectorAll('.float-header').forEach(header => {
    header.addEventListener('mousedown', (e) => {
        dragPanel = header.parentElement;
        dragPanel.style.position = 'absolute';
        dragPanel.style.zIndex = 1000;
        startX = e.clientX - dragPanel.offsetLeft;
        startY = e.clientY - dragPanel.offsetTop;
        document.addEventListener('mousemove', dragFloat);
        document.addEventListener('mouseup', stopDragFloat);
    });
});

function dragFloat(e) {
    if (!dragPanel) return;
    dragPanel.style.left = (e.clientX - startX) + 'px';
    dragPanel.style.top = (e.clientY - startY) + 'px';
}
function stopDragFloat() {
    dragPanel = null;
    document.removeEventListener('mousemove', dragFloat);
    document.removeEventListener('mouseup', stopDragFloat);
}

document.querySelectorAll('.float-header .close').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.target.closest('.float-panel').style.display = 'none';
    });
});

// ---------- Economic Calendar & News (simulasi) ----------
setInterval(() => {
    // Update berita acak
    const news = ['15:30 USD CPI (High)', '20:15 FOMC Minutes', '10:00 EUR GDP'];
    document.querySelector('#calendarPanel .float-content').innerHTML = news[Math.floor(Math.random() * news.length)];
}, 10000);

// ---------- Market Behavior Engine ----------
setInterval(() => {
    // Simulasi perubahan volatilitas berdasarkan attemptCount
    if (attemptCount > 5 && attemptCount < 10) {
        // mode trending
        symbols.forEach(s => s.bid += 0.001 * s.bid);
    } else if (attemptCount >= 10) {
        // mode high volatility
        symbols.forEach(s => s.bid += (Math.random() - 0.5) * 0.005 * s.bid);
    }
    updateMarketData();
}, 2000);

// ---------- Inisialisasi ----------
updateMarketData();
drawChart();
renderOpenPositions();

// Simulasi posisi dummy
positions.push({
    symbol: 'EURUSD', type: 'BUY', volume: 0.1, open: '1.09234', sl: '1.09000', tp: '1.09500', price: '1.09345', pl: '+12.34'
});
renderOpenPositions();

// ---------- Psychology Simulation ----------
setInterval(() => {
    if (attemptCount > 10) {
        document.querySelector('.risk-summary').innerHTML += '<br><span style="color:#f44336">⚠️ Overtrading lock</span>';
    }
}, 5000);