// ==================== LOADING SCREEN ====================
window.addEventListener('load', () => {
    const loading = document.getElementById('loadingScreen');
    loading.classList.add('hidden');
});

// ==================== COUNTDOWN TIMER (26 HARI 2 JAM 40 MENIT 16 DETIK) ====================
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
    // animasi ulang
    doaContent.style.animation = 'none';
    doaContent.offsetHeight; // reflow
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

// ==================== JADWAL SHOLAT (DUMMY) ====================
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
    if (!data) data = jadwalDummy.jakarta; // default

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

// render awal
renderJadwal('jakarta');

searchBtn.addEventListener('click', () => {
    const kota = cityInput.value;
    renderJadwal(kota);
});

// ==================== TASBIH COUNTER ====================
let tasbihCount = 0;
const tasbihDisplay = document.getElementById('tasbihCount');
const counterInfo = document.querySelector('.counter-info');
const incrementBtn = document.getElementById('incrementBtn');
const resetBtn = document.getElementById('resetBtn');

function updateTasbihInfo() {
    counterInfo.textContent = `${tasbihCount} / 33`;
}

incrementBtn.addEventListener('click', () => {
    if (tasbihCount < 33) {
        tasbihCount++;
        tasbihDisplay.textContent = tasbihCount;
        updateTasbihInfo();
    }
});

resetBtn.addEventListener('click', () => {
    tasbihCount = 0;
    tasbihDisplay.textContent = tasbihCount;
    updateTasbihInfo();
});

// ==================== KARTU UCAPAN ====================
const namaInput = document.getElementById('namaPenerima');
const previewNama = document.getElementById('previewNama');
const previewCincik = document.getElementById('previewCincik');
const unduhBtn = document.getElementById('unduhBtn');
const kartuElement = document.querySelector('.kartu');

function updateKartu() {
    let nama = namaInput.value.trim();
    if (nama === '') nama = 'Jule';
    previewNama.textContent = `Cincik ${nama}`;
    previewCincik.textContent = `Cincik ${nama}`;
}

namaInput.addEventListener('input', updateKartu);
updateKartu(); // inisialisasi

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

// ==================== FITUR BARU 1: PENGINGAT BUKA & SAHUR ====================
let notifikasiDiizinkan = false;
const requestBtn = document.getElementById('requestNotificationBtn');
const sahurTimeInput = document.getElementById('sahurTime');
const bukaTimeInput = document.getElementById('bukaTime');
const sahurCountdown = document.getElementById('sahurCountdown');
const bukaCountdown = document.getElementById('bukaCountdown');
const setSahurBtn = document.getElementById('setSahurReminder');
const setBukaBtn = document.getElementById('setBukaReminder');

// Minta izin notifikasi
requestBtn.addEventListener('click', () => {
    if (Notification.permission === 'granted') {
        notifikasiDiizinkan = true;
        alert('Notifikasi sudah diizinkan!');
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                notifikasiDiizinkan = true;
                alert('Notifikasi diizinkan!');
            }
        });
    }
});

// Hitung mundur ke waktu tertentu
function updateReminderCountdown(targetTimeStr, elementId) {
    const now = new Date();
    const [hours, minutes] = targetTimeStr.split(':').map(Number);
    const target = new Date(now);
    target.setHours(hours, minutes, 0, 0);
    
    if (target < now) {
        target.setDate(target.getDate() + 1); // besok
    }
    
    const diff = target - now;
    const diffHours = Math.floor(diff / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const diffSeconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    const element = document.getElementById(elementId);
    element.textContent = `${diffHours.toString().padStart(2, '0')}:${diffMinutes.toString().padStart(2, '0')}:${diffSeconds.toString().padStart(2, '0')}`;
    
    return diff;
}

// Update countdown setiap detik
setInterval(() => {
    updateReminderCountdown(sahurTimeInput.value, 'sahurCountdown');
    updateReminderCountdown(bukaTimeInput.value, 'bukaCountdown');
}, 1000);

// Set pengingat
function setReminder(timeInput, message) {
    if (!notifikasiDiizinkan) {
        alert('Izinkan notifikasi terlebih dahulu!');
        return;
    }
    
    const now = new Date();
    const [hours, minutes] = timeInput.value.split(':').map(Number);
    const target = new Date(now);
    target.setHours(hours, minutes, 0, 0);
    
    if (target < now) {
        target.setDate(target.getDate() + 1);
    }
    
    const delay = target - now;
    setTimeout(() => {
        new Notification('🌙 Ramadan Reminder', {
            body: message,
            icon: 'https://cdn-icons-png.flaticon.com/512/870/870136.png'
        });
    }, delay);
    
    alert(`Pengingat diatur untuk ${timeInput.value}`);
}

setSahurBtn.addEventListener('click', () => {
    setReminder(sahurTimeInput, 'Waktunya sahur! Segera makan sahur.');
});

setBukaBtn.addEventListener('click', () => {
    setReminder(bukaTimeInput, 'Waktunya berbuka! Segera berbuka puasa.');
});

// ==================== FITUR BARU 2: TRACKER IBADAH ====================
const checkboxes = document.querySelectorAll('.tracker-item input[type="checkbox"]');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const resetTrackerBtn = document.getElementById('resetTracker');

function updateTrackerProgress() {
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    const percentage = (checkedCount / checkboxes.length) * 100;
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${checkedCount}/${checkboxes.length} ibadah tercapai`;
    
    // Simpan ke localStorage
    const states = Array.from(checkboxes).map(cb => cb.checked);
    localStorage.setItem('ramadanTracker', JSON.stringify(states));
}

// Load dari localStorage
function loadTracker() {
    const saved = localStorage.getItem('ramadanTracker');
    if (saved) {
        const states = JSON.parse(saved);
        checkboxes.forEach((cb, index) => {
            cb.checked = states[index] || false;
        });
        updateTrackerProgress();
    }
}

checkboxes.forEach(cb => {
    cb.addEventListener('change', updateTrackerProgress);
});

resetTrackerBtn.addEventListener('click', () => {
    checkboxes.forEach(cb => cb.checked = false);
    updateTrackerProgress();
    localStorage.removeItem('ramadanTracker');
});

loadTracker();

// ==================== FITUR BARU 3: KUTIPAN RAMADAN HARIAN ====================
const quotes = [
    { text: "Barangsiapa berpuasa Ramadan dengan iman dan mengharap pahala, niscaya diampuni dosa-dosanya yang telah lalu.", author: "HR. Bukhari & Muslim" },
    { text: "Apabila bulan Ramadan tiba, pintu-pintu surga dibuka, pintu-pintu neraka ditutup, dan setan-setan dibelenggu.", author: "HR. Bukhari & Muslim" },
    { text: "Puasa adalah perisai. Maka ketika salah seorang dari kalian berpuasa, janganlah berkata kotor dan bertindak bodoh.", author: "HR. Bukhari" },
    { text: "Sesungguhnya di surga ada pintu yang disebut Ar-Rayyan, yang hanya dimasuki oleh orang-orang yang berpuasa.", author: "HR. Bukhari & Muslim" },
    { text: "Bau mulut orang yang berpuasa lebih harum di sisi Allah daripada minyak kasturi.", author: "HR. Bukhari & Muslim" },
    { text: "Barangsiapa memberi makan orang yang berbuka puasa, maka baginya pahala seperti orang yang berpuasa tanpa mengurangi pahala orang tersebut sedikit pun.", author: "HR. Tirmidzi" },
    { text: "Ada dua kegembiraan bagi orang yang berpuasa: kegembiraan ketika berbuka dan kegembiraan ketika bertemu Rabbnya.", author: "HR. Bukhari & Muslim" }
];

const quoteText = document.getElementById('dailyQuote');
const quoteAuthor = document.getElementById('quoteAuthor');
const refreshQuote = document.getElementById('refreshQuote');

function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}

function displayRandomQuote() {
    const quote = getRandomQuote();
    quoteText.textContent = `"${quote.text}"`;
    quoteAuthor.textContent = `— ${quote.author}`;
}

refreshQuote.addEventListener('click', displayRandomQuote);
displayRandomQuote(); // tampilkan saat load

// ==================== LAGU VIBES (PLAY/PAUSE) ====================
const audio = document.getElementById('ramadanAudio');
const playPauseBtn = document.getElementById('playPauseBtn');

// Coba autoplay (bisa gagal karena kebijakan browser)
audio.play().catch(e => console.log('Autoplay diblokir, menunggu interaksi user'));

playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i> Jeda Lagu';
    } else {
        audio.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i> Putar Lagu';
    }
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