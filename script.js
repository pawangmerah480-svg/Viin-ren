// ==================== INISIALISASI ====================
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const body = document.body;
let attemptCount = 0;
let isYesClicked = false;
const noBtnOriginalText = 'No 💔';
let shrinkTimer = null;
let disableTimer = null;
let permanentHideTriggered = false;
let hintTimer = null;
let audioCtx = null;
let confettiAnimation = null;
let hintOverlay = null;

// Posisi awal No (tengah)
function setInitialNoPosition() {
    const noRect = noBtn.getBoundingClientRect();
    noBtn.style.left = (window.innerWidth / 2 - noRect.width / 2) + 'px';
    noBtn.style.top = (window.innerHeight / 2 - noRect.height / 2) + 'px';
}
window.addEventListener('load', setInitialNoPosition);
window.addEventListener('resize', setInitialNoPosition);

// ==================== PARTIKEL HATI JATUH ====================
function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart-particle';
    const hearts = ['❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝'];
    heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (Math.random() * 7 + 8) + 's'; // 8-15 detik
    heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
    heart.style.opacity = Math.random() * 0.4 + 0.2;
    heart.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 15000);
}
setInterval(createHeart, 500);

// ==================== FUNGSI TOAST ====================
const toastMessages = [
    "Hampir tapi No cepet banget 😏💔",
    "No bilang dia takut komitmen dulu... 😅",
    "Coba Yes aja yuk, No capek lari 🏃‍♂️💨",
    "Aku tau matanya bilang Yes kok 💕👀",
    "Lama-lama No nyerah juga lho... 😉",
    "No kirim pesan: 'pilih Yes aja nanti dia pasti setuju' 💌",
    "No lagi ngambek, coba sentuh lagi 😣💢",
    "Jangan maksa dong~ No malu 😳💖",
    "No : 'Awas lo kalau klik aku lagi!' 😈",
    "Yes nungguin kamu dari tadi... ❤️🥺"
];

function showToast() {
    if (isYesClicked) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = toastMessages[Math.floor(Math.random() * toastMessages.length)];
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

// ==================== PROGRESIF YES BUTTON ====================
function updateYesButton() {
    if (isYesClicked) return;
    const scale = 1 + Math.floor(attemptCount / 3) * 0.08;
    yesBtn.style.transform = `scale(${scale})`;
    let heartCount = Math.floor(attemptCount / 3) + 1;
    yesBtn.innerHTML = `Yes ${'❤️'.repeat(heartCount)}`;
    yesBtn.style.boxShadow = `0 0 ${30 + attemptCount * 5}px #ff69b4`;
}

// ==================== FUNGSI PINDAH NO ====================
function moveNoButton(avoidCursor = false, clientX = 0, clientY = 0) {
    if (isYesClicked || permanentHideTriggered) return;

    const noRect = noBtn.getBoundingClientRect();
    const maxLeft = window.innerWidth - noRect.width - 20;
    const maxTop = window.innerHeight - noRect.height - 20;
    let newLeft, newTop;

    if (avoidCursor && clientX && clientY) {
        let attempts = 0;
        do {
            newLeft = Math.random() * maxLeft;
            newTop = Math.random() * maxTop;
            attempts++;
            if (attempts > 100) break;
        } while (Math.hypot(newLeft - clientX, newTop - clientY) < 150);
    } else {
        newLeft = Math.random() * maxLeft;
        newTop = Math.random() * maxTop;
    }

    noBtn.style.left = newLeft + 'px';
    noBtn.style.top = newTop + 'px';
}

// ==================== TRICK 1: LARI SAAT MOUSEENTER/TOUCHSTART ====================
function handleNoInteraction(e) {
    if (isYesClicked || permanentHideTriggered) return;

    e.preventDefault();

    attemptCount++;
    console.log('Attempt:', attemptCount);
    updateYesButton();

    if (attemptCount % 3 === 1 || Math.random() < 0.4) {
        showToast();
    }

    let clientX, clientY;
    if (e.type === 'touchstart') {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    // Trick 1: lari
    moveNoButton(true, clientX, clientY);

    // Trick 2: disable sementara (jika attempt > 2)
    if (attemptCount > 2) {
        if (disableTimer) clearTimeout(disableTimer);
        noBtn.style.pointerEvents = 'none';
        const disableTexts = ['Lagi mikir... 🤔', 'No lagi ngambek 😣', 'Jangan maksa dong~ 😅'];
        noBtn.textContent = disableTexts[Math.floor(Math.random() * disableTexts.length)];
        disableTimer = setTimeout(() => {
            if (isYesClicked || permanentHideTriggered) return;
            noBtn.style.pointerEvents = 'auto';
            noBtn.textContent = noBtnOriginalText;
            moveNoButton(true, clientX, clientY);
            showToast();
        }, Math.random() * 4000 + 4000);
    }

    // Trick 4: teleport + efek visual (mousedown/touchstart)
    if (e.type === 'mousedown' || e.type === 'touchstart') {
        noBtn.classList.add('shake');
        noBtn.style.filter = 'blur(3px)';
        setTimeout(() => {
            noBtn.classList.remove('shake');
            noBtn.style.filter = '';
        }, 400);

        if (clientX && clientY) {
            let newLeft = clientX - noBtn.offsetWidth / 2;
            let newTop = clientY - noBtn.offsetHeight / 2;
            newLeft = Math.max(0, Math.min(window.innerWidth - noBtn.offsetWidth, newLeft));
            newTop = Math.max(0, Math.min(window.innerHeight - noBtn.offsetHeight, newTop));
            noBtn.style.left = newLeft + 'px';
            noBtn.style.top = newTop + 'px';
        }

        if (attemptCount > 5) {
            noBtn.style.transform = `rotate(${Math.random() * 40 - 20}deg)`;
            setTimeout(() => noBtn.style.transform = '', 600);
        }
    }

    // Trick 3: mengecil jika hover terlalu lama (setelah 800ms)
    if (shrinkTimer) clearTimeout(shrinkTimer);
    shrinkTimer = setTimeout(() => {
        if (isYesClicked || permanentHideTriggered) return;
        let minScale = attemptCount > 6 ? 0.08 : 0.15;
        noBtn.style.transition = 'all 1.8s';
        noBtn.style.transform = `scale(${minScale})`;
        noBtn.style.opacity = attemptCount > 6 ? '0.2' : '0.4';
    }, 800);

    // Trick 5: Hilang permanen jika attempt >= random(8,12)
    if (!permanentHideTriggered && attemptCount >= Math.floor(Math.random() * 5) + 8) {
        permanentHideTriggered = true;
        noBtn.style.transition = 'all 1.5s';
        noBtn.style.transform = 'scale(2.5)';
        noBtn.style.opacity = '0';
        setTimeout(() => {
            if (isYesClicked) return;
            noBtn.style.display = 'none';
            const hint = document.createElement('div');
            hint.className = 'hint-overlay';
            hint.textContent = "No udah kabur permanen... sekarang cuma Yes yang tersisa nih 💔😉";
            document.body.appendChild(hint);
            yesBtn.style.transform = 'scale(1.8)';
            yesBtn.style.boxShadow = '0 0 80px #ff1493';
            yesBtn.innerHTML = 'Aku nunggu jawabanmu loh... ❤️❤️❤️';
            setTimeout(() => hint.remove(), 5000);
        }, 1500);
    }
}

// Pasang event listener
noBtn.addEventListener('mouseenter', handleNoInteraction);
noBtn.addEventListener('mousedown', handleNoInteraction);
noBtn.addEventListener('touchstart', handleNoInteraction, { passive: false });
noBtn.addEventListener('touchend', (e) => e.preventDefault());

// Reset shrink saat mouse leave
noBtn.addEventListener('mouseleave', () => {
    if (shrinkTimer) clearTimeout(shrinkTimer);
    if (isYesClicked || permanentHideTriggered) return;
    noBtn.style.transition = 'all 0.4s ease';
    noBtn.style.transform = '';
    noBtn.style.opacity = '';
});

// ==================== TIMER PASIF 50 DETIK ====================
hintTimer = setTimeout(() => {
    if (isYesClicked) return;
    hintOverlay = document.createElement('div');
    hintOverlay.className = 'hint-overlay';
    hintOverlay.textContent = "Udah 50 detik loh... Yes aja yuk, No udah lelah 😅";
    document.body.appendChild(hintOverlay);
    setTimeout(() => {
        if (hintOverlay) hintOverlay.remove();
    }, 8000);
}, 50000);

// ==================== FUNGSI CONFETTI ====================
function startConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 200;

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height - height,
            size: Math.random() * 10 + 5,
            speedY: Math.random() * 3 + 2,
            speedX: Math.random() * 2 - 1,
            color: `hsl(${Math.random() * 20 + 320}, 100%, 70%)`,
            rotation: Math.random() * 360,
        });
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += 1;
            if (p.y > height) {
                p.y = -10;
                p.x = Math.random() * width;
            }
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
            ctx.restore();
        });
        confettiAnimation = requestAnimationFrame(draw);
    }
    draw();

    setTimeout(() => {
        cancelAnimationFrame(confettiAnimation);
        ctx.clearRect(0, 0, width, height);
    }, 4000);
}

// ==================== LAGU CINTA SEDERHANA ====================
function playLoveSong() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    // Melodi sederhana: do-re-mi-fa-sol-la-si-do
    const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
    let time = audioCtx.currentTime;
    notes.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.value = 0.1;
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(time + index * 0.3);
        osc.stop(time + index * 0.3 + 0.5);
    });
}

// ==================== AKHIR (KLIK YES) ====================
yesBtn.addEventListener('click', () => {
    if (isYesClicked) return;
    isYesClicked = true;

    if (shrinkTimer) clearTimeout(shrinkTimer);
    if (disableTimer) clearTimeout(disableTimer);
    if (hintTimer) clearTimeout(hintTimer);
    if (hintOverlay) hintOverlay.remove();

    noBtn.style.transition = 'all 0.5s';
    noBtn.style.opacity = '0';
    noBtn.style.pointerEvents = 'none';
    setTimeout(() => {
        noBtn.style.display = 'none';
    }, 500);

    const finalDiv = document.getElementById('finalMessage');
    finalDiv.classList.add('show');
    finalDiv.innerHTML = `
        <h2>AKHIRNYA! ❤️❤️❤️</h2>
        <p>Aku udah tau dari awal kamu bakal bilang Yes kok 😘</p>
        <p style="font-size: 1.2rem; margin-top: 1rem;">Chat aku sekarang ya, jangan malu-malu~ 💌</p>
    `;

    startConfetti();
    playLoveSong();

    // Opsional: redirect ke WhatsApp setelah 5 detik (ganti nomor)
    // setTimeout(() => {
    //     window.location.href = "https://wa.me/6281234567890?text=Halo%20sayang%2C%20aku%20klik%20Yes!%20❤️";
    // }, 5000);
});

// Mencegah klik pada body memicu apa-apa
document.addEventListener('click', (e) => {
    if (e.target === noBtn) e.preventDefault();
});