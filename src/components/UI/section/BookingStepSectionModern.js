// BookingStepSection.js - Modern booking system with unified state

// Unified booking state object
let booking = {
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

// Configuration object for easy maintenance
const CONFIG = {
  totalSteps: 4,
  steps: [
    { id: 1, title: 'Select Service', key: 'service' },
    { id: 2, title: 'Date & Time', key: 'datetime' },
    { id: 3, title: 'Personal Info', key: 'info' },
    { id: 4, title: 'Confirm', key: 'confirm' }
  ],
  categories: {
    pmu: {
      title: 'PMU',
      services: {
        'Shading Ombré': { price: '$100', options: ['Classic', 'Ombre'] },
        'Micro Blading': { price: '$120', options: ['Micro', 'Nano'] },
        'Combo Brows': { price: '$150', options: ['Natural', 'Bold'] },
        'Lip Blush': { price: '$90', options: ['Soft', 'Bold'] }
      }
    },
    skincare: {
      title: 'Skincare',
      services: {
        'Acne Treatment': { price: '$80', options: ['Basic', 'Acne'] },
        'Hydra Facial': { price: '$120', options: ['Hydrating', 'Brightening'] },
        'Chemical Peel': { price: '$100', options: ['Chemical', 'Natural'] }
      }
    },
    detox: {
      title: 'Detox & Herbal Hair Wash',
      services: {
        'Herbal Hair Wash': { price: '$60', options: ['Herbal', 'Premium'] },
        'Scalp Detox': { price: '$80', options: ['Deep Clean', 'Scalp Massage'] }
      }
    }
  }
};

// State management functions
const BookingState = {
  // Update booking state
  update(key, value) {
    booking[key] = value;
    console.log('State updated:', key, '=', value);
    this.reactToStateChange(key, value);
  },

  // Get current state
  get(key) {
    return key ? booking[key] : booking;
  },

  // Reset to initial state
  reset() {
    booking = {
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
    console.log('State reset');
    this.reactToStateChange('reset');
  },

  // React to state changes
  reactToStateChange(key, value) {
    switch(key) {
      case 'step':
        DOM.updateStepView(value);
        DOM.updateStepIndicators(value);
        if (value === 4) DOM.updateConfirmationView();
        break;
      case 'category':
        DOM.updateServicesView(value);
        break;
      case 'reset':
        DOM.resetForm();
        break;
    }
  }
};

// Validation module
const Validation = {
  // Email validation
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  // Phone validation
  isValidPhone(phone) {
    return /^[0-9+\-\s()]+$/.test(phone) && phone.length >= 10;
  },

  // Name validation
  isValidName(name) {
    return name.length >= 2 && /^[a-zA-Z\s]+$/.test(name);
  },

  // Date validation
  isValidDate(date) {
    if (!date) return false;
    const today = new Date();
    const selectedDate = new Date(date);
    return selectedDate >= today;
  },

  // Step validation
  validateStep(stepNumber) {
    switch(stepNumber) {
      case 1:
        return booking.category && booking.service && booking.option;
      case 2:
        return booking.date && booking.time && this.isValidDate(booking.date);
      case 3:
        return this.isValidName(booking.name) && 
               this.isValidPhone(booking.phone) && 
               this.isValidEmail(booking.email);
      case 4:
        return true;
      default:
        return false;
    }
  },

  // Get validation message
  getValidationMessage(stepNumber) {
    switch(stepNumber) {
      case 1:
        return 'Please select a service and option';
      case 2:
        return 'Please select a valid date and time';
      case 3:
        return 'Please fill in all personal information correctly';
      default:
        return 'Please complete the required fields';
    }
  }
};

// DOM manipulation module
const DOM = {
  // Update step view
  updateStepView(stepNumber) {
    const container = document.getElementById('steps-container');
    if (!container) return;

    // Add CSS custom property for dynamic width calculation
    document.documentElement.style.setProperty('--total-steps', CONFIG.totalSteps);
    
    // Calculate transform percentage
    const translateX = -(stepNumber - 1) * (100 / CONFIG.totalSteps);
    container.style.transform = `translateX(${translateX}%)`;
    
    // Add transition class
    container.classList.add('transitioning');
    setTimeout(() => container.classList.remove('transitioning'), 300);
  },

  // Update step indicators
  updateStepIndicators(currentStep) {
    document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
      const stepNumber = index + 1;
      indicator.classList.remove('active', 'completed');
      
      if (stepNumber < currentStep) {
        indicator.classList.add('completed');
      } else if (stepNumber === currentStep) {
        indicator.classList.add('active');
      }
    });
  },

  // Update services view based on category
  updateServicesView(category) {
    const servicesContainer = document.querySelector('.services-groups');
    if (!servicesContainer) return;

    const categoryData = CONFIG.categories[category];
    if (!categoryData) return;

    // Hide all service groups first
    document.querySelectorAll('.service-group').forEach(group => {
      group.classList.add('hidden');
    });

    // Show selected category group
    const targetGroup = document.querySelector(`[data-group="${category}"]`);
    if (targetGroup) {
      targetGroup.classList.remove('hidden');
    }
  },

  // Update confirmation view
  updateConfirmationView() {
    const confirmInfo = document.getElementById('confirm-info');
    if (!confirmInfo) return;

    const categoryData = CONFIG.categories[booking.category];
    const serviceData = categoryData?.services[booking.service];

    confirmInfo.innerHTML = `
      <div class="bg-gray-50 p-4 rounded-lg">
        <h4 class="font-bold mb-2">Booking Summary:</h4>
        <p><strong>Service:</strong> ${booking.service} (${booking.option})</p>
        <p><strong>Price:</strong> ${serviceData?.price || 'N/A'}</p>
        <p><strong>Date:</strong> ${booking.date}</p>
        <p><strong>Time:</strong> ${booking.time}</p>
        <p><strong>Name:</strong> ${booking.name}</p>
        <p><strong>Phone:</strong> ${booking.phone}</p>
        <p><strong>Email:</strong> ${booking.email}</p>
      </div>
    `;
  },

  // Show status message
  showStatus(message, isError = false) {
    const statusEl = document.getElementById('booking-status');
    if (!statusEl) return;

    statusEl.innerHTML = `
      <div class="p-4 rounded-lg ${isError ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'} border">
        ${message}
      </div>
    `;

    // Auto hide after 5 seconds
    setTimeout(() => {
      statusEl.innerHTML = '';
    }, 5000);
  },

  // Reset form
  resetForm() {
    // Reset form inputs
    document.querySelectorAll('.field-input').forEach(input => {
      input.value = '';
      input.style.borderColor = '';
    });

    // Reset step view
    this.updateStepView(1);
    this.updateStepIndicators(1);

    // Reset tabs
    document.querySelectorAll('.tab-btn').forEach((btn, index) => {
      btn.classList.toggle('active', index === 0);
    });

    // Show first category
    this.updateServicesView('pmu');
  },

  // Show service modal
  showServiceModal(serviceName, options) {
    const modal = document.getElementById('service-modal');
    const modalName = document.getElementById('modal-service-name');
    const modalForm = document.getElementById('modal-options-form');
    
    if (!modal || !modalName || !modalForm) return;

    modalName.textContent = serviceName;
    modalForm.innerHTML = options.map((option, index) => `
      <label class="block mb-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
        <input type="radio" name="service-option" value="${option}" class="mr-2" ${index === 0 ? 'checked' : ''}>
        ${option}
      </label>
    `).join('');

    modal.style.display = 'flex';
  },

  // Hide service modal
  hideServiceModal() {
    const modal = document.getElementById('service-modal');
    if (modal) modal.style.display = 'none';
  }
};

// Event handlers module
const EventHandlers = {
  // Tab switching
  switchTab(category) {
    console.log('Switching to category:', category);
    
    // Update state
    BookingState.update('category', category);
    
    // Update tab UI
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === category);
    });
  },

  // Service selection
  selectService(serviceBtn) {
    const serviceName = serviceBtn.textContent.split('(')[0].trim();
    const options = JSON.parse(serviceBtn.dataset.options || '[]');
    
    console.log('Service selected:', serviceName, 'Options:', options);
    
    BookingState.update('service', serviceName);
    DOM.showServiceModal(serviceName, options);
  },

  // Option selection
  selectOption() {
    const selectedRadio = document.querySelector('input[name="service-option"]:checked');
    if (!selectedRadio) {
      alert('Please select an option');
      return;
    }

    BookingState.update('option', selectedRadio.value);
    DOM.hideServiceModal();
    console.log('Option selected:', selectedRadio.value);
  },

  // Step navigation
  nextStep() {
    const currentStep = booking.step;
    console.log('Next step requested from:', currentStep);

    // Collect current step data
    this.collectStepData(currentStep);

    // Validate current step
    if (!Validation.validateStep(currentStep)) {
      DOM.showStatus(Validation.getValidationMessage(currentStep), true);
      return;
    }

    // Move to next step
    if (currentStep < CONFIG.totalSteps) {
      BookingState.update('step', currentStep + 1);
    }
  },

  prevStep() {
    const currentStep = booking.step;
    if (currentStep > 1) {
      BookingState.update('step', currentStep - 1);
    }
  },

  // Collect step data from form
  collectStepData(stepNumber) {
    switch(stepNumber) {
      case 2:
        const dateInput = document.getElementById('date');
        const timeInput = document.getElementById('time');
        if (dateInput) BookingState.update('date', dateInput.value);
        if (timeInput) BookingState.update('time', timeInput.value);
        break;
      case 3:
        const nameInput = document.getElementById('name');
        const phoneInput = document.getElementById('phone');
        const emailInput = document.getElementById('email');
        if (nameInput) BookingState.update('name', nameInput.value);
        if (phoneInput) BookingState.update('phone', phoneInput.value);
        if (emailInput) BookingState.update('email', emailInput.value);
        break;
    }
  },

  // Submit booking
  async submitBooking() {
    console.log('Submitting booking with data:', booking);

    // Final validation
    this.collectStepData(3);
    if (!Validation.validateStep(3)) {
      DOM.showStatus(Validation.getValidationMessage(3), true);
      return;
    }

    const submitBtn = document.querySelector('.submit-btn');
    if (!submitBtn) return;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    DOM.showStatus('Submitting your booking...');

    try {
      // Prepare submission data
      const submissionData = {
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

      // Submit to API
      const response = await fetch('/.netlify/functions/submitBooking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      const result = await response.json();

      if (result.success) {
        DOM.showStatus('Booking submitted successfully! We will contact you within 24 hours.');
        
        // Reset form after 3 seconds
        setTimeout(() => {
          BookingState.reset();
        }, 3000);
      } else {
        throw new Error(result.error || 'Submission failed');
      }

    } catch (error) {
      console.error('Booking submission error:', error);
      DOM.showStatus('Failed to submit booking. Please try again or contact us directly.', true);
    } finally {
      // Restore button state
      submitBtn.disabled = false;
      submitBtn.textContent = 'Confirm & Book';
    }
  }
};

// Real-time field validation
const FieldValidation = {
  validateField(field) {
    const value = field.value;
    let isValid = true;
    let message = '';

    switch(field.type) {
      case 'email':
        isValid = Validation.isValidEmail(value);
        message = isValid ? '' : 'Please enter a valid email address';
        break;
      case 'tel':
      case 'text':
        if (field.id === 'phone') {
          isValid = Validation.isValidPhone(value);
          message = isValid ? '' : 'Please enter a valid phone number';
        } else if (field.id === 'name') {
          isValid = Validation.isValidName(value);
          message = isValid ? '' : 'Please enter a valid name (letters only, min 2 chars)';
        }
        break;
      case 'date':
        isValid = Validation.isValidDate(value);
        message = isValid ? '' : 'Please select a future date';
        break;
    }

    // Visual feedback
    field.style.borderColor = isValid ? '#10b981' : '#ef4444';
    
    // Show/hide error message
    let errorMsg = field.parentNode.querySelector('.error-message');
    if (!errorMsg && !isValid) {
      errorMsg = document.createElement('div');
      errorMsg.className = 'error-message text-red-500 text-sm mt-1';
      field.parentNode.appendChild(errorMsg);
    }
    
    if (errorMsg) {
      errorMsg.textContent = message;
      errorMsg.style.display = isValid ? 'none' : 'block';
    }

    return isValid;
  }
};

// Initialize booking system
document.addEventListener('DOMContentLoaded', function() {
  console.log('Booking system initializing...');

  // Set initial state
  document.documentElement.style.setProperty('--total-steps', CONFIG.totalSteps);
  
  // Initial UI setup
  DOM.updateStepView(1);
  DOM.updateStepIndicators(1);
  DOM.updateServicesView('pmu');

  // Event delegation for better performance
  document.addEventListener('click', function(e) {
    // Tab switching
    if (e.target.classList.contains('tab-btn')) {
      const category = e.target.dataset.tab;
      EventHandlers.switchTab(category);
    }
    
    // Service selection
    if (e.target.classList.contains('service-btn')) {
      EventHandlers.selectService(e.target);
    }
    
    // Modal actions
    if (e.target.classList.contains('select-option')) {
      EventHandlers.selectOption();
    }
    if (e.target.classList.contains('close-modal')) {
      DOM.hideServiceModal();
    }
    
    // Step navigation
    if (e.target.classList.contains('next-btn')) {
      EventHandlers.nextStep();
    }
    if (e.target.classList.contains('prev-btn')) {
      EventHandlers.prevStep();
    }
    if (e.target.classList.contains('submit-btn')) {
      EventHandlers.submitBooking();
    }
  });

  // Real-time validation
  document.addEventListener('input', function(e) {
    if (e.target.classList.contains('field-input')) {
      FieldValidation.validateField(e.target);
    }
  });

  // Close modal when clicking outside
  document.addEventListener('click', function(e) {
    const modal = document.getElementById('service-modal');
    if (e.target === modal) {
      DOM.hideServiceModal();
    }
  });

  console.log('Booking system initialized successfully');
  console.log('Initial state:', booking);
});