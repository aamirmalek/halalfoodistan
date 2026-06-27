const STORAGE_KEY = 'halal-foodistan-lead-progress';
const steps = Array.from(document.querySelectorAll('.step'));
const form = document.getElementById('leadForm');
const thankYou = document.getElementById('thankYou');
const progressBar = document.getElementById('progressBar');
const resumeNotice = document.getElementById('resumeNotice');
let currentStep = 0;

function isValidPhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

function isValidEmail(email) {
  const value = String(email || '').trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && !value.includes('..');
}

function clearFieldState(field) {
  const wrapper = field.closest('label') || field.parentElement;
  wrapper.classList.remove('error');
  field.setCustomValidity('');
}

function setFieldError(field, message) {
  const wrapper = field.closest('label') || field.parentElement;
  wrapper.classList.add('error');
  field.setCustomValidity(message);
}

function setGroupError(step, name, hasError) {
  const group = step.querySelector(`input[name="${name}"]`)?.closest('.choice-grid');
  if (group) {
    group.classList.toggle('error', hasError);
  }
}

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
  let isValid = true;

  current.querySelectorAll('input, select, textarea').forEach(clearFieldState);
  current.querySelectorAll('.choice-grid').forEach((group) => group.classList.remove('error'));

  if (currentStep === 0) {
    const requiredFields = current.querySelectorAll('input[required], textarea[required]');
    requiredFields.forEach((field) => {
      const value = field.value.trim();
      if (!value) {
        setFieldError(field, 'This field is required.');
        isValid = false;
        return;
      }

      if (field.name === 'phone' && !isValidPhone(value)) {
        setFieldError(field, 'Please enter a valid phone number with at least 10 digits.');
        isValid = false;
      }

      if (field.name === 'email' && !isValidEmail(value)) {
        setFieldError(field, 'Please enter a valid email address.');
        isValid = false;
      }
    });
  }

  if (currentStep === 1) {
    const serviceSelected = current.querySelector('input[name="services"]:checked');
    const businessTypeSelected = current.querySelector('input[name="businessType"]:checked');

    if (!serviceSelected) {
      setGroupError(current, 'services', true);
      isValid = false;
    }

    if (!businessTypeSelected) {
      setGroupError(current, 'businessType', true);
      isValid = false;
    }
  }

  if (currentStep === 2) {
    const contactMethodSelected = current.querySelector('input[name="contactMethod"]:checked');
    if (!contactMethodSelected) {
      setGroupError(current, 'contactMethod', true);
      isValid = false;
    }
  }

  if (currentStep === 3) {
    const consent = current.querySelector('input[name="consent"]');
    if (consent && !consent.checked) {
      setFieldError(consent, 'Please agree before submitting.');
      isValid = false;
    }
  }

  if (!isValid) {
    const firstInvalid = current.querySelector('.error input, .choice-grid.error input, input:invalid');
    if (firstInvalid && typeof firstInvalid.focus === 'function') {
      firstInvalid.focus();
    }
    return false;
  }

  return true;
}

function collectFormData() {
  const data = Object.fromEntries(new FormData(form).entries());
  data.services = Array.from(form.querySelectorAll('input[name="services"]:checked')).map((box) => box.value);
  data.submittedAt = new Date().toISOString();
  data.leadScore = calculateLeadScore(data);
  data.recommendation = getRecommendation(data);
  return data;
}

function calculateLeadScore(data) {
  const services = Array.isArray(data.services) ? data.services : [];
  let score = 28;

  if (data.businessName) score += 12;
  if (data.contactName) score += 8;
  if (isValidPhone(data.phone)) score += 15;
  if (isValidEmail(data.email)) score += 15;
  if (data.businessType) score += 10;
  if (services.length) score += Math.min(services.length * 6, 18);
  if (data.notes) score += 5;
  if (data.contactTime) score += 3;

  return Math.min(score, 100);
}

function getRecommendation(data) {
  const services = Array.isArray(data.services) ? data.services : [];
  const serviceCount = services.length;

  if (serviceCount >= 4) {
    return 'Full-service recommendation: content, campaigns, and ongoing social support for steady growth.';
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
      if (key === 'services') return;
      const fields = form.querySelectorAll(`[name="${key}"]`);
      if (!fields.length) return;

      const first = fields[0];
      if (first.type === 'radio') {
        fields.forEach((radio) => {
          radio.checked = radio.value === value;
        });
      } else if (first.type === 'checkbox') {
        fields.forEach((checkbox) => {
          checkbox.checked = Boolean(value);
        });
      } else {
        first.value = value;
      }
    });

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
    <h3>Thank you, ${data.contactName || data.businessName || 'friend'}.</h3>
    <p>Your inquiry has been captured and we will review it shortly.</p>
    <p><strong>Services:</strong> ${services.length ? services.join(', ') : 'Not specified'}</p>
    <p><strong>Lead score:</strong> ${data.leadScore}/100</p>
    <p><strong>Recommendation:</strong> ${data.recommendation}</p>
    <p>We will contact you at ${data.phone || data.email || 'your preferred contact point'} soon.</p>
  `;
}

function validateAllContactFields() {
  const phone = form.querySelector('[name="phone"]');
  const email = form.querySelector('[name="email"]');

  if (phone) {
    const value = phone.value.trim();
    clearFieldState(phone);
    if (!value) {
      setFieldError(phone, 'Phone number is required.');
      return false;
    }
    if (!isValidPhone(value)) {
      setFieldError(phone, 'Please enter a valid phone number with at least 10 digits.');
      return false;
    }
  }

  if (email) {
    const value = email.value.trim();
    clearFieldState(email);
    if (!value) {
      setFieldError(email, 'Email is required.');
      return false;
    }
    if (!isValidEmail(value)) {
      setFieldError(email, 'Please enter a valid email address.');
      return false;
    }
  }

  return true;
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

form.querySelectorAll('[name="phone"], [name="email"]').forEach((field) => {
  field.addEventListener('blur', () => {
    validateAllContactFields();
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

  if (!validateAllContactFields()) return;
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
