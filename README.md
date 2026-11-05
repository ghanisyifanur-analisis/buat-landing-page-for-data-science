# DataVal.ai — Jasa Testing Data Science & Full Continuous Deployment (CD)

> Platform landing page modern, interaktif, dan performan tinggi untuk jasa pengujian Machine Learning/Data Science end-to-end yang dilengkapi arsitektur Full Continuous Deployment (CD).

Live Preview: [https://antigravity.luch.dev/site/76467947-b4d1-4290-845d-6845058319d1/b7ec6a02f49c8c9936ca6ac0/](https://antigravity.luch.dev/site/76467947-b4d1-4290-845d-6845058319d1/b7ec6a02f49c8c9936ca6ac0/)

---

## 📑 Daftar Isi
1. [Latar Belakang & Masalah yang Diselesaikan](#1-latar-belakang--masalah-yang-diselesaikan)
2. [Arsitektur Full CD untuk Data Science](#2-arsitektur-full-cd-untuk-data-science)
3. [Alur Kerja Pipeline Langkah demi Langkah](#3-alur-kerja-pipeline-langkah-demi-langkah)
4. [Fitur Unggulan Landing Page](#4-fitur-unggulan-landing-page)
5. [Struktur Proyek](#5-struktur-proyek)
6. [Audit Aksesibilitas (WCAG 2.1 AA)](#6-audit-aksesibilitas-wcag-21-aa)
7. [Audit Performa, Kualitas Kode & Keamanan](#7-audit-performa-kualitas-kode--keamanan)
8. [Panduan Menjalankan & Mengembangkan](#8-panduan-menjalankan--mengembangkan)

---

## 1. Latar Belakang & Masalah yang Diselesaikan

Dalam software engineering konvensional, bug biasanya berakar pada kegagalan sintaks atau logika kode yang dapat ditangkap oleh *unit test*. Namun pada sistem berbasis **Data Science & Machine Learning**, model yang kodenya 100% bebas dari bug sintaks tetap bisa berakibat fatal di production jika:
- Terjadi **Data Drift** (perubahan distribusi demografi atau perilaku transaksi pengguna di dunia nyata).
- Terjadi **Data Leakage** saat pelatihan.
- Terjadi penurunan akurasi pada segmen data minoritas (**Fairness & Bias violation**).
- Waktu inferensi model melanggar **SLA Latency** sistem backend.

**DataVal.ai** hadir sebagai penyedia jasa testing komprehensif dan setup Full CD otomatis yang menggabungkan:
1. **Continuous Integration (CI)**: Linting, static typing, dan unit tests.
2. **Continuous Testing (CT)**: Uji integritas skema data (Great Expectations), deteksi drift distribusi (Evidently), dan evaluasi adversarial invariant.
3. **Continuous Deployment (CD)**: Rilis bertahap ke *Canary Fleet* (10% traffic), verifikasi *smoke test*, dan promosi otomatis ke 100% traffic production dengan mekanisme *instant auto-rollback*.

---

## 2. Arsitektur Full CD untuk Data Science

```
[ Git Push / Commit ]
         │
         ▼
[ Stage 1: Code Lint & Type Check ] ── (Ruff, Flake8, MyPy)
         │
         ▼
[ Stage 2: Data Quality & Schema ] ── (Great Expectations, Drift Check)
         │  └─► [DRIFT / OUTLIER?] ──► [BLOCKED: Alert Tim DS]
         ▼
[ Stage 3: Model Quality Gate ] ──── (Akurasi >= 94%, Invariance, Latency < 50ms)
         │  └─► [FAIL GATE?] ────────► [DEPLOYMENT DIBATALKAN]
         ▼
[ Stage 4: Docker & Security ] ───── (Multi-stage build, Trivy Scan)
         │
         ▼
[ Stage 5: Canary CD Rollout ] ───── (10% Traffic Gate -> Smoke Test -> 100% Prod)
            └─► [ANOMALI?] ──────────► [AUTOMATED ROLLBACK]
```

---

## 3. Alur Kerja Pipeline Langkah demi Langkah

### Tahap 1: Code Quality & Type Check
- **Alat**: `ruff`, `black`, `mypy`.
- **Tujuan**: Memastikan standar penulisan kode Python konsisten, tidak ada variabel yang berpotensi `None` tanpa penanganan tipe data.

### Tahap 2: Data Integrity & Drift Detection
- **Alat**: `pytest`, `great_expectations`, `scipy.stats`.
- **Tujuan**: Memeriksa kelengkapan kolom, rentang numerik, batas null, dan uji Kolmogorov-Smirnov / PSI untuk membandingkan distribusi fitur batch baru terhadap baseline pelatihan.

### Tahap 3: Model Invariant & Quality Gate
- **Alat**: `tests/test_model_pipeline.py`, `tests/verify_model_gate.py`.
- **Tujuan**:
  - Menguji *adversarial invariance*: penambahan noise kecil tidak boleh membalikkan prediksi secara ekstrem.
  - Memverifikasi batasan *p99 inference latency* (di bawah SLA 50ms).
  - Memverifikasi akurasi minimum (&ge; 94.0%) dan ketiadaan kebocoran data (*data leakage*).

### Tahap 4: Container Build & Trivy Security Scan
- **Alat**: `docker/Dockerfile`, `trivy`.
- **Tujuan**: Membangun image container multi-stage berbasis non-root user (UID 10001) dan memindai vulnerabilitas CVE (Critical & High).

### Tahap 5: Canary Deployment & Auto-Rollback
- **Alat**: GitHub Actions deployment environment, Kubernetes / Cloud Run.
- **Tujuan**: Mengalihkan 10% traffic riil ke instance baru untuk smoke test otomatis. Jika respon `200 OK` dan latensi stabil, traffic dinaikkan ke 100%. Jika terjadi kegagalan, perintah `rollout undo` dipicu seketika.

---

## 4. Fitur Unggulan Landing Page

- **Hero HUD Live Terminal**: Visualisasi langsung hasil passing checks pipeline CD di banner utama.
- **Simulator CI/CD Interaktif**:
  - Tombol **"Jalankan Full CD (Passing Run)"**: mensimulasikan alur sukses dari commit hingga produksi.
  - Tombol **"Simulasikan Data Drift (Fail Run)"**: memperagakan bagaimana pipeline secara cerdas memblokir rilis jika terdeteksi data drift yang signifikan.
  - Console log real-time dengan stempel waktu dan penanda status.
- **Kalkulator Penghematan ROI**: Slider interaktif untuk menghitung jam kerja tim data science yang dihemat dan nilai penghematan biaya bulanan.
- **Code Inspector Interaktif**: Tab penampil file konfigurasi asli (`data-science-cd.yml`, `test_model_pipeline.py`, `Dockerfile`) dengan fitur salin sekali klik (*copy to clipboard*).
- **Katalog Layanan & Arsitektur Perbandingan**: Komparasi eksplisit CI/CD tradisional vs Full CD Data Science.
- **Formulir Konsultasi & Modal Accessible**: Dialog formulir yang mendukung keyboard ESC, autofocus, validasi field, dan toast konfirmasi.
- **FAQ Accordion Berstandar Aksesibilitas**: Navigasi keyboard penuh (Enter/Space) dengan atribut ARIA.

---

## 5. Struktur Proyek

```
├── .github/
│   └── workflows/
│       └── data-science-cd.yml   # Workflow GitHub Actions Full CI/CD
├── css/
│   └── styles.css                # CSS modular, modern, responsive, WCAG AA
├── docker/
│   └── Dockerfile                # Multi-stage hardened production container
├── js/
│   └── app.js                    # Logika interaktif simulator, kalkulator & modal
├── tests/
│   ├── test_data_quality.py      # Uji integritas skema data & outlier
│   ├── test_model_pipeline.py    # Uji invariant & benchmark SLA model
│   └── verify_model_gate.py      # Quality gate script penentu kelayakan rilis CD
├── docker-compose.yml            # Konfigurasi orkestrasi lokal
├── index.html                    # Halaman landing page utama
├── requirements.txt              # Dependensi testing & MLOps
└── README.md                     # Dokumentasi komprehensif
```

---

## 6. Audit Aksesibilitas (WCAG 2.1 AA)

| Aspek | Status | Penerapan |
|---|---|---|
| **Keyboard Navigation** | ✅ Lulus | Seluruh tombol, link, tab kode, accordion FAQ, dan modal form dapat diakses dengan tombol Tab/Shift+Tab, Enter, Space, dan Escape. |
| **Skip to Content** | ✅ Lulus | Terdapat `<a href="#main-content" class="skip-link">` di awal halaman untuk navigasi cepat pembaca layar. |
| **Visible Focus Ring** | ✅ Lulus | `:focus-visible` dengan outline cyan terang 2px dan offset 3px di seluruh elemen interaktif. |
| **Screen Reader Semantics** | ✅ Lulus | Penggunaan landmark HTML5 (`header`, `nav`, `main`, `section`, `article`, `footer`), `aria-expanded`, `aria-live="polite"` pada terminal simulator, dan `role="dialog"` pada modal. |
| **Color & Contrast** | ✅ Lulus | Rasio kontras teks utama (`#f8fafc`) terhadap latar belakang gelap (`#070b14`) mencapai **15.4:1** (jauh melampaui standar minimum 4.5:1 untuk WCAG AA). |
| **Motion Accessibility** | ✅ Lulus | Dilengkapi `@media (prefers-reduced-motion: reduce)` yang mematikan animasi bagi pengguna yang sensitif terhadap gerakan. |

---

## 7. Audit Performa, Kualitas Kode & Keamanan

1. **Performa**:
   - Zero external libraries (Vanilla JS murni & Native CSS murni).
   - Tidak ada blocking synchronous scripts; loading secepat kilat tanpa Cumulative Layout Shift (CLS = 0).
2. **Kualitas Kode**:
   - Arsitektur CSS berbasis Custom Properties (CSS Variables) untuk kemudahan penyesuaian tema (*themeability*).
   - Vanilla JS modular dengan fungsi terisolasi (`initSimulator`, `initCalculator`, dll.).
3. **Keamanan**:
   - Tidak ada `eval()` atau `innerHTML` berbahaya dari input pengguna luar.
   - Container Docker menggunakan user non-root (UID 10001) untuk mencegah *privilege escalation*.

---

## 8. Panduan Menjalankan & Mengembangkan

### Menjalankan Landing Page secara Lokal
Karena landing page ini dibangun dengan standar web modern tanpa compiler rumit, Anda cukup membuka `index.html` langsung di browser, atau menggunakan server lokal:

```bash
# Menggunakan Python 3:
python3 -m http.server 8080

# Lalu buka di browser:
# http://localhost:8080
```

### Menjalankan Uji Otomasi Model Data Science
Untuk menguji pipeline model testing di environment lokal:

```bash
# Menjalankan Model QA & SLA Benchmark:
python3 tests/verify_model_gate.py --min-accuracy 0.94 --max-latency-ms 50
```

---

*Dikembangkan oleh DataVal.ai Solutions — Standar Tertinggi untuk Pengujian & Otomasi Continuous Deployment Data Science.*
