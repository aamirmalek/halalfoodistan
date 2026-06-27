const STORAGE_KEY = 'halal-foodistan-lead-progress';
const steps = Array.from(document.querySelectorAll('.step'));
const form = document.getElementById('leadForm');
const thankYou = document.getElementById('thankYou');
const progressBar = document.getElementById('progressBar');
const resumeNotice = document.getElementById('resumeNotice');
let currentStep = 0;

function updateProgress() {
  const progress = ((currentStep + 1) / steps.length) * 100;
  progressBar.style.width = `${progress}%`;
}

function showStep(index) {
  steps.forEach((step, i) => {
    step.classList.toggle('active', i === index);
  });
  currentStep = index;
  updateProgress();
}

function validateCurrentStep() {
  const current = steps[currentStep];
  const fields = current.querySelectorAll('input[required], select[required], textarea[required]');
  let isValid = true;

  fields.forEach((field) => {
    const wrapper = field.closest('label') || field.parentElement;
    wrapper.classList.remove('error');

    const isEmpty = field.type === 'checkbox' ? !field.checked : !field.value.trim();
    if (isEmpty) {
      wrapper.classList.add('error');
      isValid = false;
    }
  });

  if (!isValid) {
    return false;
  }

  return true;
}

function collectFormData() {
  const data = Object.fromEntries(new FormData(form).entries());
  data.services = Array.from(form.querySelectorAll('input[name="services"]:checked')).map((box) => box.value);
  data.platforms = Array.from(form.querySelectorAll('input[name="platforms"]:checked')).map((box) => box.value);
  data.submittedAt = new Date().toISOString();
  data.leadScore = calculateLeadScore(data);
  data.recommendation = getRecommendation(data);
  return data;
}

function calculateLeadScore(data) {
  const services = Array.isArray(data.services) ? data.services : [];
  const platforms = Array.isArray(data.platforms) ? data.platforms : [];
  let score = 28;

  if (data.businessName) score += 12;
  if (data.phone && data.email) score += 15;
  if (data.businessType) score += 10;
  if (data.goal) score += 10;
  if (data.budget && data.budget !== 'Under $500') score += 10;
  if (services.length) score += Math.min(services.length * 6, 18);
  if (platforms.length) score += 8;
  if (data.notes) score += 5;
  if (data.projectFocus) score += 4;
  if (data.contactTime) score += 3;

  return Math.min(score, 100);
}

function getRecommendation(data) {
  const services = Array.isArray(data.services) ? data.services : [];
  const serviceCount = services.length;

  if (data.budget === '$3000+' || data.budget === '$1500-$3000' || serviceCount >= 4) {
    return 'Full-service recommendation: content, campaigns, and ongoing social support for steady growth.';
  }

  if (data.budget === 'Under $500') {
    return 'Starter recommendation: a focused content and social plan with quick wins first.';
  }

  if (serviceCount >= 2) {
    return 'Growth recommendation: a solid mix of content, social, and local promotion.';
  }

  return 'Starter recommendation: we can begin with one clear service and build from there.';
}

function saveProgress() {
  const payload = collectFormData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function restoreProgress() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return;

  try {
    const data = JSON.parse(stored);
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'platforms' || key === 'services') return;
      const field = form.querySelector(`[name="${key}"]`);
      if (field) {
        if (field.type === 'checkbox') {
          field.checked = Boolean(value);
        } else {
          field.value = value;
        }
      }
    });

    if (Array.isArray(data.platforms)) {
      data.platforms.forEach((platform) => {
        const checkbox = form.querySelector(`input[name="platforms"][value="${platform}"]`);
        if (checkbox) checkbox.checked = true;
      });
    }

    if (Array.isArray(data.services)) {
      data.services.forEach((service) => {
        const checkbox = form.querySelector(`input[name="services"][value="${service}"]`);
        if (checkbox) checkbox.checked = true;
      });
    }

    resumeNotice.innerHTML = 'A saved draft was found. <button type="button" id="resumeBtn">Resume it</button>';
    resumeNotice.classList.remove('hidden');
    document.getElementById('resumeBtn').addEventListener('click', () => {
      resumeNotice.classList.add('hidden');
      showStep(0);
    });
  } catch (error) {
    console.error('Unable to restore saved form', error);
  }
}

function toggleConditionalFields() {
  return;
}

function showThankYou(data) {
  const services = Array.isArray(data.services) ? data.services : [];
  form.classList.add('hidden');
  thankYou.classList.remove('hidden');
  thankYou.innerHTML = `
    <h3>Thank you, ${data.ownerName || data.businessName || 'friend'}.</h3>
    <p>Your inquiry has been captured and we will review it shortly.</p>
    <p><strong>Services:</strong> ${services.length ? services.join(', ') : 'Not specified'}</p>
    <p><strong>Lead score:</strong> ${data.leadScore}/100</p>
    <p><strong>Recommendation:</strong> ${data.recommendation}</p>
    <p>We will contact you at ${data.phone || data.email || 'your preferred contact point'} soon.</p>
  `;
}

steps.forEach((step, index) => {
  step.querySelectorAll('input, select, textarea').forEach((field) => {
    field.addEventListener('input', saveProgress);
    field.addEventListener('change', () => {
      saveProgress();
      toggleConditionalFields();
    });
  });
});

document.querySelectorAll('.next').forEach((button) => {
  button.addEventListener('click', () => {
    if (!validateCurrentStep()) return;
    showStep(Math.min(currentStep + 1, steps.length - 1));
  });
});

document.querySelectorAll('.prev').forEach((button) => {
  button.addEventListener('click', () => {
    showStep(Math.max(currentStep - 1, 0));
  });
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!validateCurrentStep()) return;

  const payload = collectFormData();
  saveProgress();

  try {
    const endpoint = window.FORM_CONFIG?.apiUrl || '';
    if (endpoint) {
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    } else {
      console.info('No submission endpoint configured yet.');
    }
  } catch (error) {
    console.error('Lead submission failed', error);
  }

  localStorage.removeItem(STORAGE_KEY);
  showThankYou(payload);
});

showStep(0);
updateProgress();
toggleConditionalFields();
restoreProgress();
