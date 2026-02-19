// ==================== INISIALISASI CANVAS ====================
const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');

// Ukuran canvas tetap 800x800 agar detail terjaga
canvas.width = 800;
canvas.height = 800;

// ==================== VARIABEL GLOBAL ====================
let text = 'nama kamu';          // teks yang digambar (default diubah)
let color = '#ff69b4';           // warna pink neon
let baseSize = 1.0;              // faktor skala hati (dari slider)
let time = 0;                    // waktu untuk animasi

// ==================== ELEMEN KONTROL ====================
const textInput = document.getElementById('textInput');
const colorPicker = document.getElementById('colorPicker');
const sizeSlider = document.getElementById('sizeSlider');
const sizeValue = document.getElementById('sizeValue');
const resetBtn = document.getElementById('resetBtn');

// ==================== FUNGSI MENGGAMBAR HATI ====================
/**
 * Menggambar hati dengan titik-titik teks.
 * Menggunakan persamaan parametrik hati:
 * x = 16 sin^3 t
 * y = 13 cos t - 5 cos 2t - 2 cos 3t - cos 4t
 * dengan tambahan variasi radius (r) untuk menebalkan bentuk.
 */
function drawHeart() {
    // Bersihkan canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Setting gaya teks
    ctx.font = '12px "Courier New", monospace';
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Pusat canvas (titik tengah)
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Skala dasar untuk menyesuaikan ukuran hati di canvas
    const scale = 15 * baseSize;  // faktor skala global (dikombinasikan dengan animasi)

    // Animasi: pulse (perubahan skala) dan rotasi
    const pulse = 1 + 0.03 * Math.sin(time * 2);   // efek denyut (perubahan skala ±3%)
    const angle = 0.01 * Math.sin(time * 0.5);     // rotasi pelan (maks ±0.01 rad)

    // Parameter ketebalan: kita akan menggambar beberapa lapis dengan radius berbeda
    // untuk mengisi bagian dalam hati.
    const radiusSteps = 6;          // jumlah lapisan ketebalan
    const tSteps = 300;             // jumlah titik per lapisan (semakin banyak semakin padat)

    for (let r = 0.8; r <= 1.2; r += 0.4 / radiusSteps) {  // variasi radius dari 0.8 hingga 1.2
        for (let i = 0; i < tSteps; i++) {
            // t dari 0 sampai 2π
            const t = (i / tSteps) * 2 * Math.PI;

            // Hitung koordinat dasar (belum diskalakan dan diputar)
            let xBase = 16 * Math.pow(Math.sin(t), 3);
            let yBase = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);

            // Terapkan variasi radius (r) untuk ketebalan
            xBase *= r;
            yBase *= r;

            // Skala dengan faktor ukuran dan pulse
            let x = xBase * scale * pulse;
            let y = yBase * scale * pulse;

            // Rotasi pelan (mengelilingi pusat)
            const xRot = x * Math.cos(angle) - y * Math.sin(angle);
            const yRot = x * Math.sin(angle) + y * Math.cos(angle);
            x = xRot;
            y = yRot;

            // Translasi ke pusat canvas
            const canvasX = centerX + x;
            const canvasY = centerY - y;  // y dibalik karena koordinat canvas ke bawah

            // Gambar teks pada posisi yang sudah dihitung
            ctx.fillText(text, canvasX, canvasY);
        }
    }

    // Perbarui tampilan slider value
    sizeValue.textContent = baseSize.toFixed(2);
}

// ==================== ANIMASI LOOP ====================
function animate() {
    time += 0.02;           // increment waktu untuk animasi
    drawHeart();            // gambar ulang hati dengan parameter waktu terbaru
    requestAnimationFrame(animate);
}

// ==================== INTERAKTIF ====================
// Ubah teks
textInput.addEventListener('input', (e) => {
    text = e.target.value || ' ';   // jika kosong, beri spasi agar tetap ada titik
});

// Ubah warna
colorPicker.addEventListener('input', (e) => {
    color = e.target.value;
});

// Ubah ukuran
sizeSlider.addEventListener('input', (e) => {
    baseSize = parseFloat(e.target.value);
});

// Reset ke default
resetBtn.addEventListener('click', () => {
    textInput.value = 'nama kamu';
    text = 'nama kamu';
    colorPicker.value = '#ff69b4';
    color = '#ff69b4';
    sizeSlider.value = '1.0';
    baseSize = 1.0;
});

// ==================== MULAI ANIMASI ====================
animate();

// ==================== RESPONSIF: SESUAIKAN UKURAN CANVAS DI CSS ====================
// Ukuran canvas sudah tetap 800x800, CSS akan membuatnya responsif.