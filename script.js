// ==================== LOADING SCREEN ====================
window.addEventListener('load', () => {
    const loading = document.getElementById('loadingScreen');
    loading.classList.add('hidden');
});

// ==================== COUNTDOWN TIMER ====================
let days = 26, hours = 2, minutes = 40, seconds = 16;
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

function updateCountdown() {
    if (seconds > 0) {
        seconds--;
    } else {
        if (minutes > 0) {
            minutes--;
            seconds = 59;
        } else {
            if (hours > 0) {
                hours--;
                minutes = 59;
                seconds = 59;
            } else {
                if (days > 0) {
                    days--;
                    hours = 23;
                    minutes = 59;
                    seconds = 59;
                } else {
                    clearInterval(countdownInterval);
                }
            }
        }
    }
    
    daysEl.textContent = days.toString().padStart(2, '0');
    hoursEl.textContent = hours.toString().padStart(2, '0');
    minutesEl.textContent = minutes.toString().padStart(2, '0');
    secondsEl.textContent = seconds.toString().padStart(2, '0');
}

const countdownInterval = setInterval(updateCountdown, 1000);

// ==================== DOA TOGGLE ====================
const btnBerbuka = document.getElementById('btnBerbuka');
const btnSahur = document.getElementById('btnSahur');
const doaContent = document.getElementById('doaContent');

const doaData = {
    berbuka: {
        arab: 'اللَّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ',
        translit: 'Allahumma laka shumtu wa bika amantu wa \'ala rizqika aftartu',
        arti: '"Ya Allah, karena-Mu aku berpuasa, kepada-Mu aku beriman, dan dengan rezeki-Mu aku berbuka."'
    },
    sahur: {
        arab: 'نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هَذِهِ السَّنَةِ لِلَّهِ تَعَالَى',
        translit: 'Nawaitu sauma ghadin \'an adā\'i fardhi syahri Ramadāna hāżihis-sanati lillāhi ta\'ālā',
        arti: '"Aku niat berpuasa esok hari untuk menunaikan kewajiban puasa bulan Ramadan tahun ini karena Allah Ta\'ala."'
    }
};

function setDoa(type) {
    const data = doaData[type];
    doaContent.innerHTML = `
        <p class="arab">${data.arab}</p>
        <p class="transliteration">${data.translit}</p>
        <p class="translation">${data.arti}</p>
    `;
    doaContent.style.animation = 'none';
    doaContent.offsetHeight;
    doaContent.style.animation = 'fadeScale 0.5s ease';
}

btnBerbuka.addEventListener('click', () => {
    btnBerbuka.classList.add('active');
    btnSahur.classList.remove('active');
    setDoa('berbuka');
});

btnSahur.addEventListener('click', () => {
    btnSahur.classList.add('active');
    btnBerbuka.classList.remove('active');
    setDoa('sahur');
});

// ==================== JADWAL SHOLAT ====================
const scheduleCards = document.getElementById('scheduleCards');
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');

const jadwalDummy = {
    jakarta: [
        { name: 'Subuh', time: '04:30' },
        { name: 'Dzuhur', time: '12:00' },
        { name: 'Ashar', time: '15:15' },
        { name: 'Maghrib', time: '18:00' },
        { name: 'Isya', time: '19:20' }
    ],
    bandung: [
        { name: 'Subuh', time: '04:25' },
        { name: 'Dzuhur', time: '11:55' },
        { name: 'Ashar', time: '15:10' },
        { name: 'Maghrib', time: '17:55' },
        { name: 'Isya', time: '19:15' }
    ],
    surabaya: [
        { name: 'Subuh', time: '04:15' },
        { name: 'Dzuhur', time: '11:45' },
        { name: 'Ashar', time: '15:00' },
        { name: 'Maghrib', time: '17:45' },
        { name: 'Isya', time: '19:05' }
    ]
};

function renderJadwal(kota) {
    const key = kota.toLowerCase().trim();
    let data = jadwalDummy[key];
    if (!data) data = jadwalDummy.jakarta;

    let html = '';
    data.forEach(item => {
        html += `
            <div class="schedule-item">
                <div class="name">${item.name}</div>
                <div class="time">${item.time}</div>
            </div>
        `;
    });
    scheduleCards.innerHTML = html;
}

renderJadwal('jakarta');

searchBtn.addEventListener('click', () => {
    const kota = cityInput.value;
    renderJadwal(kota);
});

// ==================== TASBIH COUNTER ====================
let tasbihCount = 0;
const tasbihDisplay = document.getElementById('tasbihCount');
const incrementBtn = document.getElementById('incrementBtn');
const resetBtn = document.getElementById('resetBtn');

incrementBtn.addEventListener('click', () => {
    tasbihCount++;
    tasbihDisplay.textContent = tasbihCount;
});

resetBtn.addEventListener('click', () => {
    tasbihCount = 0;
    tasbihDisplay.textContent = tasbihCount;
});

// ==================== KARTU UCAPAN ====================
const namaInput = document.getElementById('namaPenerima');
const previewNama = document.getElementById('previewNama');
const unduhBtn = document.getElementById('unduhBtn');
const kartuElement = document.querySelector('.kartu');

namaInput.addEventListener('input', (e) => {
    let nama = e.target.value.trim();
    if (nama === '') nama = 'Jule';
    previewNama.textContent = nama;
});

unduhBtn.addEventListener('click', () => {
    html2canvas(kartuElement, {
        backgroundColor: null,
        scale: 2
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'kartu-ramadan.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }).catch(error => {
        alert('Gagal mengunduh kartu. Silakan coba lagi.');
        console.error(error);
    });
});

// ==================== PARALLAX ====================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const stars = document.querySelector('.stars');
    const crescent = document.querySelector('.crescent');
    if (stars) {
        stars.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
    if (crescent) {
        crescent.style.transform = `rotate(25deg) translateY(${scrolled * 0.1}px)`;
    }
});

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});