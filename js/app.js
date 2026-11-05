/**
 * DataVal.ai - Interactive Logic for Data Science Testing & Full CD Landing Page
 * Zero external dependencies, accessible, high performance
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initSimulator();
  initCalculator();
  initCodeViewer();
  initFaqAccordion();
  initModalAndForms();
});

/* ==========================================================================
   1. Mobile Navigation
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const navLinks = document.getElementById('navLinks');

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    navLinks.classList.toggle('open');
  });

  // Close when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   2. Interactive CI/CD Pipeline Simulator
   ========================================================================== */
function initSimulator() {
  const runPassBtn = document.getElementById('simRunPassBtn');
  const runFailBtn = document.getElementById('simRunFailBtn');
  const resetBtn = document.getElementById('simResetBtn');
  const consoleEl = document.getElementById('simConsoleOutput');
  const overallStatusEl = document.getElementById('simOverallStatus');

  const steps = [
    { id: 'step-1', name: 'Lint & Type Check', duration: 700 },
    { id: 'step-2', name: 'Data Quality & Schema', duration: 1000 },
    { id: 'step-3', name: 'Model QA Gate', duration: 1100 },
    { id: 'step-4', name: 'Docker Security Scan', duration: 900 },
    { id: 'step-5', name: 'Continuous Deployment (CD)', duration: 1200 }
  ];

  let isRunning = false;

  function appendLog(text, type = 'normal') {
    const time = new Date().toTimeString().split(' ')[0];
    const line = document.createElement('div');
    line.className = 'term-line';

    let colorClass = 'term-text';
    if (type === 'pass') colorClass = 'term-pass';
    if (type === 'fail') colorClass = 'term-fail';
    if (type === 'info') colorClass = 'term-info';
    if (type === 'warn') colorClass = 'term-warn';
    if (type === 'comment') colorClass = 'term-comment';

    line.innerHTML = `<span class="term-comment">[${time}]</span> <span class="${colorClass}">${text}</span>`;
    consoleEl.appendChild(line);
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }

  function setStepState(index, state, text) {
    const stepEl = document.getElementById(steps[index].id);
    if (!stepEl) return;

    stepEl.classList.remove('active', 'success', 'failed');
    const badge = stepEl.querySelector('.step-indicator');

    badge.className = `step-indicator state-${state}`;
    badge.textContent = text;

    if (state === 'running') stepEl.classList.add('active');
    if (state === 'passed') stepEl.classList.add('success');
    if (state === 'failed') stepEl.classList.add('failed');
  }

  function resetSimulator() {
    isRunning = false;
    consoleEl.innerHTML = '';
    appendLog('Simulator siap. Klik tombol "Jalankan Full CD Pipeline" untuk simulasi.', 'comment');

    steps.forEach((_, idx) => {
      setStepState(idx, 'pending', 'MENUNGGU');
    });

    overallStatusEl.innerHTML = '<span class="pulse-dot"></span> Status: Standby';
    runPassBtn.disabled = false;
    runFailBtn.disabled = false;
  }

  async function runSimulation(shouldFailDrift = false) {
    if (isRunning) return;
    isRunning = true;
    runPassBtn.disabled = true;
    runFailBtn.disabled = true;
    consoleEl.innerHTML = '';

    overallStatusEl.innerHTML = '<span class="pulse-dot" style="background:#06b6d4"></span> Pipeline CI/CD Berjalan...';
    appendLog('🚀 [TRIGGER] Commit terdeteksi pada branch main: "feat: update fraud detection weights"', 'info');
    appendLog('⚡ Memulai automated workflow: .github/workflows/data-science-cd.yml', 'comment');

    for (let i = 0; i < steps.length; i++) {
      setStepState(i, 'running', 'RUNNING...');

      if (i === 0) {
        appendLog('▶ Menjalankan Ruff Linter & MyPy static type checks...', 'info');
        await wait(steps[i].duration);
        appendLog('✓ 0 error linting, format black terverifikasi, tipe data valid.', 'pass');
        setStepState(i, 'passed', 'PASSED (0.7s)');
      } else if (i === 1) {
        appendLog('▶ Menjalankan Great Expectations: Schema validation & distribution tests...', 'info');
        await wait(steps[i].duration);

        if (shouldFailDrift) {
          // Trigger failure on data drift
          appendLog('⚠️ WARNING: Perubahan distribusi kolom "transaction_amount" terdeteksi!', 'warn');
          appendLog('❌ FAILED: Kolmogorov-Smirnov p-value = 0.0012 (< threshold 0.05). Significant Data Drift!', 'fail');
          appendLog('⛔ Pipeline CI/CD dihentikan untuk mencegah model corrupt di production.', 'fail');
          appendLog('🛡️ PagerDuty & Slack alert otomatis dikirimkan ke Tim Data Science.', 'comment');
          setStepState(i, 'failed', 'DRIFT DETECTED');
          overallStatusEl.innerHTML = '<span class="pulse-dot" style="background:#ef4444"></span> Status: Pipeline Blocked (Data Drift)';
          isRunning = false;
          runPassBtn.disabled = false;
          runFailBtn.disabled = false;
          return;
        } else {
          appendLog('✓ Data schema: 6/6 kolom cocok. Null rate: 0.00%. Drift p-value: 0.84 (> 0.05).', 'pass');
          setStepState(i, 'passed', 'PASSED (1.0s)');
        }
      } else if (i === 2) {
        appendLog('▶ Mengevaluasi Model QA Gate: Invariance, Adversarial Robustness & SLA Latency...', 'info');
        await wait(steps[i].duration);
        appendLog('✓ Akurasi Model: 96.40% (Target: >= 94.00%)', 'pass');
        appendLog('✓ F1 Score: 95.10% | Data Leakage: NONE', 'pass');
        appendLog('✓ p99 Inference Latency: 22.8ms (Target SLA: < 50ms)', 'pass');
        setStepState(i, 'passed', 'PASSED (1.1s)');
      } else if (i === 3) {
        appendLog('▶ Build Docker Container & Trivy Vulnerability Security Scan...', 'info');
        await wait(steps[i].duration);
        appendLog('✓ Docker image ghcr.io/dataval/inference:v2.4.1 berhasil di-build.', 'pass');
        appendLog('✓ Trivy Scan: 0 Critical, 0 High vulnerabilities. Container aman.', 'pass');
        setStepState(i, 'passed', 'SECURE (0.9s)');
      } else if (i === 4) {
        appendLog('▶ Continuous Deployment (CD): Canary rollout 10% traffic...', 'info');
        await wait(steps[i].duration / 2);
        appendLog('✓ Canary endpoint respons 200 OK pada 50 synthetic requests.', 'pass');
        appendLog('▶ Mempromosikan ke 100% Production Traffic (Zero Downtime)...', 'info');
        await wait(steps[i].duration / 2);
        appendLog('🎉 [FULL CD SUCCESS] Model versi 2.4.1 resmi live di Production tanpa downtime!', 'pass');
        setStepState(i, 'passed', 'DEPLOYED (1.2s)');
      }
    }

    overallStatusEl.innerHTML = '<span class="pulse-dot" style="background:#10b981"></span> Status: CD Berhasil Selesai (Live)';
    isRunning = false;
    runPassBtn.disabled = false;
    runFailBtn.disabled = false;
  }

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  if (runPassBtn) runPassBtn.addEventListener('click', () => runSimulation(false));
  if (runFailBtn) runFailBtn.addEventListener('click', () => runSimulation(true));
  if (resetBtn) resetBtn.addEventListener('click', resetSimulator);

  // Initialize display
  resetSimulator();
}

/* ==========================================================================
   3. Interactive ROI & Cost Calculator
   ========================================================================== */
function initCalculator() {
  const modelRange = document.getElementById('calcModelCount');
  const retrainRange = document.getElementById('calcRetrainFreq');
  const modelValDisplay = document.getElementById('calcModelCountVal');
  const retrainValDisplay = document.getElementById('calcRetrainFreqVal');

  const hoursDisplay = document.getElementById('calcHoursSaved');
  const savingsDisplay = document.getElementById('calcCostSaved');
  const recPlanDisplay = document.getElementById('calcRecPlan');

  if (!modelRange || !retrainRange) return;

  function updateCalculations() {
    const models = parseInt(modelRange.value, 10);
    const retrains = parseInt(retrainRange.value, 10);

    modelValDisplay.textContent = `${models} Model`;
    retrainValDisplay.textContent = `${retrains}x / Bulan`;

    // Each manual deployment/testing cycle takes ~18 engineering hours
    // With Full CD, reduced to 1 hour automated oversight. Saved: 17 hrs per cycle
    const hoursSavedPerMonth = models * retrains * 14;
    // Average Senior ML Engineer hourly rate ~ Rp 250,000 / hour
    const monthlyCostSavedIDR = hoursSavedPerMonth * 250000;

    hoursDisplay.textContent = `${hoursSavedPerMonth.toLocaleString('id-ID')} Jam`;
    savingsDisplay.textContent = `Rp ${Math.round(monthlyCostSavedIDR / 1000000).toLocaleString('id-ID')} Juta`;

    // Plan recommendation
    if (models <= 3 && retrains <= 4) {
      recPlanDisplay.textContent = 'Paket Model QA Audit / Starter';
    } else if (models <= 12) {
      recPlanDisplay.textContent = 'Paket Full CI/CD Integration (Direkomendasikan)';
    } else {
      recPlanDisplay.textContent = 'Paket Enterprise Managed MLOps & CD';
    }
  }

  modelRange.addEventListener('input', updateCalculations);
  retrainRange.addEventListener('input', updateCalculations);
  updateCalculations();
}

/* ==========================================================================
   4. Code Viewer Tabs & Clipboard
   ========================================================================== */
function initCodeViewer() {
  const tabs = document.querySelectorAll('.code-tab-btn');
  const display = document.getElementById('codeViewerContent');
  const copyBtn = document.getElementById('codeCopyBtn');

  const codeSnippets = {
    'ci-cd': `# .github/workflows/data-science-cd.yml
name: Data Science Full Continuous Deployment (CD)

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  data-quality-gate:
    name: 1. Great Expectations & Drift Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Validate Feature Schema & Anomaly
        run: pytest tests/test_data_quality.py -v

  model-evaluation:
    name: 2. Model Invariance & Latency SLA
    needs: data-quality-gate
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Test Suite
        run: pytest tests/test_model_pipeline.py -v
      - name: Enforce Gate SLA (Accuracy >= 94%, Latency < 50ms)
        run: python tests/verify_model_gate.py

  continuous-deployment:
    name: 3. Zero-Downtime Canary Rollout (CD)
    needs: model-evaluation
    runs-on: ubuntu-latest
    steps:
      - name: Deploy Canary 10%
        run: kubectl apply -f k8s/canary-deployment.yaml
      - name: Smoke Test Endpoint
        run: curl -f https://canary.dataval.ai/health
      - name: Promote to 100% Production Traffic
        run: kubectl rollout status deployment/ml-inference-prod`,

    'pytest': `# tests/test_model_pipeline.py
import pytest
import numpy as np
from src.model import FraudDetectionModel

@pytest.fixture
def model():
    return FraudDetectionModel.load("models/v2.4.1")

def test_inference_latency_sla(model):
    """Ensure p99 latency is below 30ms for 50-record batch."""
    batch = np.random.randn(50, 8)
    latencies = [benchmark(model.predict, batch) for _ in range(50)]
    assert np.percentile(latencies, 99) < 30.0

def test_adversarial_invariance(model):
    """Small epsilon noise must not alter critical fraud probability by > 5%."""
    sample = np.array([[1.2, -0.5, 0.0, 3.4, -1.1, 0.8, -0.2, 0.4]])
    noise = np.random.normal(0, 0.005, size=sample.shape)
    diff = abs(model.predict(sample) - model.predict(sample + noise))
    assert diff < 0.05, "Model excessively sensitive to noise"`,

    'docker': `# docker/Dockerfile (Multi-Stage Production Container)
FROM python:3.11-slim as builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

FROM python:3.11-slim as runner
WORKDIR /app
RUN groupadd -g 10001 dsgroup && useradd -u 10001 -g dsgroup dsuser
COPY --from=builder /root/.local /home/dsuser/.local
COPY --chown=dsuser:dsgroup . /app
ENV PATH=/home/dsuser/.local/bin:$PATH
USER 10001:10001
EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=3s CMD curl -f http://localhost:8080/health || exit 1
CMD ["uvicorn", "src.api:app", "--host", "0.0.0.0", "--port", "8080"]`
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const targetKey = tab.getAttribute('data-code');
      if (codeSnippets[targetKey]) {
        display.textContent = codeSnippets[targetKey];
      }
    });
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(display.textContent);
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '✓ Tersalin!';
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 2000);
      } catch (err) {
        console.error('Copy failed', err);
      }
    });
  }
}

/* ==========================================================================
   5. FAQ Accordion (Accessible Keyboard & Screen Reader)
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!questionBtn || !answer) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
          const otherBtn = otherItem.querySelector('.faq-question');
          const otherAns = otherItem.querySelector('.faq-answer');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherAns) otherAns.style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove('open');
        questionBtn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('open');
        questionBtn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   6. Consultation Modal & Contact Form
   ========================================================================== */
function initModalAndForms() {
  const modal = document.getElementById('consultModal');
  const openBtns = document.querySelectorAll('.js-open-consult');
  const closeBtn = document.getElementById('modalCloseBtn');
  const consultForm = document.getElementById('consultForm');
  const toast = document.getElementById('toastNotice');
  const toastMsg = document.getElementById('toastMessage');

  function openModal() {
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('input');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  function showToast(message) {
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  if (consultForm) {
    consultForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('formName').value;
      const email = document.getElementById('formEmail').value;
      const plan = document.getElementById('formService').value;

      closeModal();
      consultForm.reset();
      showToast(`Terima kasih, ${name}! Tim Senior MLOps kami akan menghubungi Anda di ${email} dalam waktu < 2 jam.`);
    });
  }
}
