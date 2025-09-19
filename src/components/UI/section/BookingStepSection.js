// BookingStepSection.js - Booking logic module

// Create and initialize the BookingSystem as a global object
window.BookingSystem = {
  // State object instead of global variables
  state: {
    step: 1,
    category: 'pmu',
    service: '',
    option: '',
    date: '',
    time: '',
  name: '',
  phone: '',
  email: ''
};

// Steps configuration
const STEPS = [
  { id: 1, title: 'Select Service', key: 'service' },
  { id: 2, title: 'Date & Time', key: 'datetime' },
  { id: 3, title: 'Personal Info', key: 'info' },
  { id: 4, title: 'Confirm', key: 'confirm' }
];

// Service categories configuration
const SERVICE_CATEGORIES = {
  pmu: {
    title: 'PMU',
    groups: [
      {
        title: 'Brows',
        services: [
          { id: 'pmu1', name: 'Shading Ombré ($100)', options: ['Classic', 'Ombre'] },
          { id: 'pmu2', name: 'Micro Blading ($120)', options: ['Micro', 'Nano'] },
          { id: 'pmu3', name: 'Combo Brows ($150)', options: ['Natural', 'Bold'] }
        ]
      },
      {
        title: 'Lips',
        services: [
          { id: 'pmu4', name: 'Lip Blush ($90)', options: ['Soft', 'Bold'] }
        ]
      }
    ]
  },
  skincare: {
    title: 'Skincare',
    groups: [
      {
        title: 'Facial Treatments',
        services: [
          { id: 'skin1', name: 'Acne Treatment ($80)', options: ['Basic', 'Acne'] },
          { id: 'skin2', name: 'Hydra Facial ($120)', options: ['Hydrating', 'Brightening'] },
          { id: 'skin3', name: 'Chemical Peel ($100)', options: ['Chemical', 'Natural'] }
        ]
      }
    ]
  },
  detox: {
    title: 'Detox & Herbal Hair Wash',
    groups: [
      {
        title: 'Hair Treatments',
        services: [
          { id: 'detox1', name: 'Herbal Hair Wash ($60)', options: ['Herbal', 'Premium'] },
          { id: 'detox2', name: 'Scalp Detox ($80)', options: ['Deep Clean', 'Scalp Massage'] }
        ]
      }
    ]
  }
};

// Validation functions
const validation = {
  step1: () => {
    if (!booking.category || !booking.service || !booking.option) {
      return { valid: false, message: 'Vui lòng chọn đầy đủ dịch vụ và option!' };
    }
    return { valid: true };
  },
  
  step2: () => {
    if (!booking.date || !booking.time) {
      return { valid: false, message: 'Vui lòng chọn ngày và giờ!' };
    }
    return { valid: true };
  },
  
  step3: () => {
    if (!booking.name || !booking.phone || !booking.email) {
      return { valid: false, message: 'Vui lòng nhập đầy đủ thông tin cá nhân!' };
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(booking.email)) {
      return { valid: false, message: 'Email không hợp lệ!' };
    }
    
    // Phone validation
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(booking.phone)) {
      return { valid: false, message: 'Số điện thoại không hợp lệ!' };
    }
    
    return { valid: true };
  }
};

// UI update functions
function updateStepIndicators(currentStep) {
  const indicators = document.querySelectorAll('.step-indicator');
  indicators.forEach((indicator, index) => {
    const stepNumber = index + 1;
    indicator.classList.remove('active', 'completed');
    
    if (stepNumber < currentStep) {
      indicator.classList.add('completed');
    } else if (stepNumber === currentStep) {
      indicator.classList.add('active');
    }
  });
}

function updateStepPosition(step) {
  const container = document.getElementById('steps-container');
  if (container) {
    const translateX = -(step - 1) * 25;
    container.style.transform = `translateX(${translateX}%)`;
  }
}

function showStep(stepNumber) {
  booking.step = stepNumber;
  updateStepIndicators(stepNumber);
  updateStepPosition(stepNumber);
  
  console.log(`Moved to step ${stepNumber}`);
}

function updateBookingData(field, value) {
  booking[field] = value;
  console.log(`Updated ${field}:`, value);
  console.log('Current booking state:', booking);
}

function switchCategory(categoryKey) {
  updateBookingData('category', categoryKey);
  
  // Reset service and option when category changes
  updateBookingData('service', '');
  updateBookingData('option', '');
  
  // Update UI
  renderServiceGroups(categoryKey);
  updateTabButtons(categoryKey);
}

function renderServiceGroups(activeCategory) {
  const container = document.querySelector('.services-groups');
  if (!container) return;
  
  container.innerHTML = '';
  
  Object.entries(SERVICE_CATEGORIES).forEach(([categoryKey, category]) => {
    const isActive = categoryKey === activeCategory;
    const groupDiv = document.createElement('div');
    groupDiv.className = `service-group ${isActive ? 'visible' : 'hidden'}`;
    groupDiv.dataset.group = categoryKey;
    
    category.groups.forEach(group => {
      const groupTitle = document.createElement('div');
      groupTitle.className = 'font-semibold mb-2 mt-4';
      groupTitle.textContent = group.title;
      groupDiv.appendChild(groupTitle);
      
      const serviceList = document.createElement('div');
      serviceList.className = 'service-list flex gap-2 flex-wrap';
      
      group.services.forEach(service => {
        const serviceBtn = document.createElement('button');
        serviceBtn.className = 'service-btn px-3 py-2 bg-[#e7d48e] rounded';
        serviceBtn.textContent = service.name;
        serviceBtn.dataset.service = service.id;
        serviceBtn.dataset.options = JSON.stringify(service.options);
        
        serviceBtn.addEventListener('click', () => openServiceModal(service));
        serviceList.appendChild(serviceBtn);
      });
      
      groupDiv.appendChild(serviceList);
    });
    
    container.appendChild(groupDiv);
  });
}

function updateTabButtons(activeCategory) {
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === activeCategory);
  });
}

function openServiceModal(service) {
  updateBookingData('service', service.id);
  
  const modal = document.getElementById('service-modal');
  const modalName = document.getElementById('modal-service-name');
  const form = document.getElementById('modal-options-form');
  
  if (modalName) modalName.textContent = service.name;
  if (form) {
    form.innerHTML = service.options.map(option => 
      `<label class='block mb-2'>
        <input type='radio' name='service-option' value='${option}' class="mr-2"> 
        ${option}
      </label>`
    ).join('');
  }
  
  if (modal) modal.style.display = 'flex';
}

function closeServiceModal() {
  const modal = document.getElementById('service-modal');
  if (modal) modal.style.display = 'none';
}

function selectServiceOption() {
  const checked = document.querySelector('input[name="service-option"]:checked');
  if (checked) {
    updateBookingData('option', checked.value);
    closeServiceModal();
  } else {
    alert('Vui lòng chọn option!');
  }
}

function validateCurrentStep() {
  const validator = validation[`step${booking.step}`];
  if (validator) {
    const result = validator();
    if (!result.valid) {
      alert(result.message);
    }
    return result.valid;
  }
  return true;
}

function updateConfirmInfo() {
  const confirmInfo = document.getElementById('confirm-info');
  if (!confirmInfo) return;
  
  confirmInfo.innerHTML = `
    <div class="bg-gray-50 p-4 rounded-lg">
      <h4 class="font-bold mb-2">Booking Summary:</h4>
      <p><strong>Service:</strong> ${booking.category} - ${booking.service} (${booking.option})</p>
      <p><strong>Date:</strong> ${booking.date || 'Not selected'}</p>
      <p><strong>Time:</strong> ${booking.time || 'Not selected'}</p>
      <p><strong>Name:</strong> ${booking.name || 'Not provided'}</p>
      <p><strong>Phone:</strong> ${booking.phone || 'Not provided'}</p>
      <p><strong>Email:</strong> ${booking.email || 'Not provided'}</p>
    </div>
  `;
}

async function submitBooking() {
  const bookingData = {
    category: booking.category,
    service: booking.service,
    option: booking.option,
    date: booking.date,
    time: booking.time,
    name: booking.name,
    phone: booking.phone,
    email: booking.email,
    notes: 'Submitted via website booking system'
  };

  try {
    const response = await fetch('/.netlify/functions/submitBooking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });

    const result = await response.json();
    
    if (result.success) {
      showSuccessMessage();
      resetBooking();
    } else {
      throw new Error(result.error || 'Submission failed');
    }
  } catch (error) {
    showErrorMessage(error.message);
  }
}

function showSuccessMessage() {
  const statusEl = document.getElementById('booking-status');
  if (statusEl) {
    statusEl.innerHTML = `
      <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
        <strong>Success!</strong> Your booking has been submitted successfully.
        We'll contact you within 24 hours to confirm.
      </div>
    `;
  }
}

function showErrorMessage(message) {
  const statusEl = document.getElementById('booking-status');
  if (statusEl) {
    statusEl.innerHTML = `
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Error!</strong> ${message}
      </div>
    `;
  }
}

function resetBooking() {
  booking = {
    step: 1,
    category: '',
    service: '',
    option: '',
    date: '',
    time: '',
    name: '',
    phone: '',
    email: ''
  };
  
  setTimeout(() => {
    showStep(1);
    const statusEl = document.getElementById('booking-status');
    if (statusEl) statusEl.innerHTML = '';
  }, 3000);
}

// Initialize booking system
function initBookingSystem() {
  console.log('Initializing Booking System...');
  
  // Render initial state
  showStep(1);
  switchCategory('pmu'); // Default category
  
  // Setup event listeners
  setupEventListeners();
  
  console.log('Booking System initialized');
}

function setupEventListeners() {
  // Tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchCategory(btn.dataset.tab);
    });
  });
  
  // Navigation buttons
  document.querySelectorAll('.next-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateCurrentStep() && booking.step < 4) {
        showStep(booking.step + 1);
        if (booking.step === 4) {
          updateConfirmInfo();
        }
      }
    });
  });
  
  document.querySelectorAll('.prev-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (booking.step > 1) {
        showStep(booking.step - 1);
      }
    });
  });
  
  // Modal buttons
  const closeModalBtn = document.querySelector('.close-modal');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeServiceModal);
  }
  
  const selectOptionBtn = document.querySelector('.select-option');
  if (selectOptionBtn) {
    selectOptionBtn.addEventListener('click', selectServiceOption);
  }
  
  // Submit button
  const submitBtn = document.querySelector('.submit-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      if (validateCurrentStep()) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        try {
          await submitBooking();
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Confirm & Book';
        }
      }
    });
  }
  
  // Form inputs with live binding
  const inputs = {
    date: document.getElementById('date'),
    time: document.getElementById('time'),
    name: document.getElementById('name'),
    phone: document.getElementById('phone'),
    email: document.getElementById('email')
  };
  
  Object.entries(inputs).forEach(([field, input]) => {
    if (input) {
      input.addEventListener('input', (e) => {
        updateBookingData(field, e.target.value);
      });
    }
  });
}

// Export for use in Astro component
if (typeof window !== 'undefined') {
  window.BookingSystem = {
    init: initBookingSystem,
    booking,
    switchCategory,
    showStep,
    updateBookingData
  };
}