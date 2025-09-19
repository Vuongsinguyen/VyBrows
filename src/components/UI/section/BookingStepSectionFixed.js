// BookingStepSection.js - Refactored Booking System

// Global BookingSystem object with complete functionality
window.BookingSystem = {
  // State management
  state: {
    currentStep: 1,
    selectedCategory: 'pmu',
    selectedService: null,
    selectedOption: null,
    bookingData: {
      service: '',
      option: '',
      date: '',
      time: '',
      name: '',
      phone: '',
      email: ''
    }
  },

  // Configuration
  config: {
    steps: [
      { id: 1, title: 'Select Service', key: 'service' },
      { id: 2, title: 'Date & Time', key: 'datetime' },
      { id: 3, title: 'Personal Info', key: 'info' },
      { id: 4, title: 'Confirm', key: 'confirm' }
    ],
    
    serviceCategories: {
      pmu: {
        title: 'PMU',
        services: {
          'Microblading': {
            options: [
              { name: 'Basic Microblading', price: '$200', duration: '2h' },
              { name: 'Premium Microblading', price: '$300', duration: '2.5h' }
            ]
          },
          'Eyebrow Tattoo': {
            options: [
              { name: 'Natural Brow', price: '$180', duration: '1.5h' },
              { name: 'Bold Brow', price: '$220', duration: '2h' }
            ]
          },
          'Lip Tattoo': {
            options: [
              { name: 'Lip Liner', price: '$150', duration: '1h' },
              { name: 'Full Lip Color', price: '$250', duration: '2h' }
            ]
          }
        }
      },
      skincare: {
        title: 'Skincare',
        services: {
          'Facial Treatment': {
            options: [
              { name: 'Basic Facial', price: '$80', duration: '1h' },
              { name: 'Deep Cleansing', price: '$120', duration: '1.5h' }
            ]
          },
          'Acne Treatment': {
            options: [
              { name: 'Basic Treatment', price: '$100', duration: '1h' },
              { name: 'Advanced Treatment', price: '$150', duration: '1.5h' }
            ]
          }
        }
      },
      detox: {
        title: 'Detox & Herbal Hair Wash',
        services: {
          'Hair Detox': {
            options: [
              { name: 'Basic Detox', price: '$60', duration: '45min' },
              { name: 'Premium Detox', price: '$90', duration: '1h' }
            ]
          },
          'Herbal Wash': {
            options: [
              { name: 'Herbal Treatment', price: '$50', duration: '30min' },
              { name: 'Deep Herbal Wash', price: '$70', duration: '45min' }
            ]
          }
        }
      }
    }
  },

  // Validation module
  validation: {
    isValidEmail: function(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    
    isValidPhone: function(phone) {
      return /^[0-9+\-\s()]+$/.test(phone) && phone.length >= 10;
    },
    
    isValidName: function(name) {
      return name.length >= 2 && /^[a-zA-Z\s]+$/.test(name);
    },
    
    isValidDate: function(date) {
      const today = new Date();
      const selectedDate = new Date(date);
      return selectedDate >= today;
    },
    
    validateStep: function(stepNumber) {
      const self = window.BookingSystem;
      const state = self.state;
      
      switch(stepNumber) {
        case 1:
          return state.selectedService && state.selectedOption;
        case 2:
          return state.bookingData.date && state.bookingData.time && 
                 self.validation.isValidDate(state.bookingData.date);
        case 3:
          return self.validation.isValidName(state.bookingData.name) &&
                 self.validation.isValidPhone(state.bookingData.phone) &&
                 self.validation.isValidEmail(state.bookingData.email);
        case 4:
          return true;
        default:
          return false;
      }
    }
  },

  // DOM manipulation helpers
  dom: {
    updateStepIndicators: function(currentStep) {
      const indicators = document.querySelectorAll('.step-indicator');
      indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index + 1 <= currentStep);
      });
    },

    showStep: function(stepNumber) {
      const steps = document.querySelectorAll('.step');
      steps.forEach((step, index) => {
        step.style.display = index + 1 === stepNumber ? 'block' : 'none';
      });
    },

    showStatus: function(message, isError = false) {
      const statusDiv = document.getElementById('booking-status');
      if (statusDiv) {
        statusDiv.textContent = message;
        statusDiv.className = `mt-6 text-center font-semibold ${isError ? 'text-red-600' : 'text-green-600'}`;
        setTimeout(() => {
          statusDiv.textContent = '';
          statusDiv.className = 'mt-6 text-center font-semibold';
        }, 5000);
      }
    },

    renderServices: function(category) {
      const self = window.BookingSystem;
      const servicesContainer = document.querySelector('.services-groups');
      if (!servicesContainer) return;

      const services = self.config.serviceCategories[category]?.services || {};
      servicesContainer.innerHTML = Object.keys(services).map(serviceName => `
        <button class="service-btn block w-full text-left p-3 mb-2 border rounded-lg hover:bg-gray-50" 
                data-service="${serviceName}">
          ${serviceName}
        </button>
      `).join('');
    },

    renderServiceModal: function(serviceName, options) {
      const modalForm = document.getElementById('modal-options-form');
      const modalServiceName = document.getElementById('modal-service-name');
      
      if (modalServiceName) {
        modalServiceName.textContent = serviceName;
      }
      
      if (modalForm && options) {
        modalForm.innerHTML = options.map((option, index) => `
          <label class="block mb-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
            <input type="radio" name="service-option" value="${option.name}" 
                   data-price="${option.price}" data-duration="${option.duration}" 
                   class="mr-2" ${index === 0 ? 'checked' : ''}>
            <strong>${option.name}</strong> - ${option.price} (${option.duration})
          </label>
        `).join('');
      }
    },

    renderConfirmation: function() {
      const self = window.BookingSystem;
      const confirmDiv = document.getElementById('confirm-info');
      if (!confirmDiv) return;

      const { bookingData, selectedService, selectedOption } = self.state;
      confirmDiv.innerHTML = `
        <div class="bg-gray-50 p-4 rounded-lg">
          <p><strong>Service:</strong> ${selectedService}</p>
          <p><strong>Option:</strong> ${selectedOption?.name} - ${selectedOption?.price}</p>
          <p><strong>Date:</strong> ${bookingData.date}</p>
          <p><strong>Time:</strong> ${bookingData.time}</p>
          <p><strong>Name:</strong> ${bookingData.name}</p>
          <p><strong>Phone:</strong> ${bookingData.phone}</p>
          <p><strong>Email:</strong> ${bookingData.email}</p>
        </div>
      `;
    }
  },

  // Event handlers
  handlers: {
    switchTab: function(category) {
      const self = window.BookingSystem;
      console.log('Switching tab to:', category);
      
      // Update state
      self.state.selectedCategory = category;
      
      // Update UI
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === category);
      });
      
      // Render services for selected category
      self.dom.renderServices(category);
    },

    selectService: function(serviceName) {
      const self = window.BookingSystem;
      const category = self.state.selectedCategory;
      const services = self.config.serviceCategories[category]?.services;
      
      if (services && services[serviceName]) {
        const options = services[serviceName].options;
        self.state.selectedService = serviceName;
        
        // Show modal with options
        self.dom.renderServiceModal(serviceName, options);
        const modal = document.getElementById('service-modal');
        if (modal) {
          modal.style.display = 'flex';
        }
      }
    },

    selectOption: function() {
      const self = window.BookingSystem;
      const selectedRadio = document.querySelector('input[name="service-option"]:checked');
      
      if (selectedRadio) {
        self.state.selectedOption = {
          name: selectedRadio.value,
          price: selectedRadio.dataset.price,
          duration: selectedRadio.dataset.duration
        };
        
        // Close modal
        const modal = document.getElementById('service-modal');
        if (modal) {
          modal.style.display = 'none';
        }
        
        console.log('Selected option:', self.state.selectedOption);
      }
    },

    closeModal: function() {
      const modal = document.getElementById('service-modal');
      if (modal) {
        modal.style.display = 'none';
      }
    },

    nextStep: function() {
      const self = window.BookingSystem;
      const currentStep = self.state.currentStep;
      
      // Validate current step
      if (!self.validation.validateStep(currentStep)) {
        self.dom.showStatus('Please complete all required fields before continuing.', true);
        return;
      }
      
      // Collect data from current step
      self.collectStepData(currentStep);
      
      // Move to next step
      if (currentStep < 4) {
        self.state.currentStep = currentStep + 1;
        self.dom.showStep(self.state.currentStep);
        self.dom.updateStepIndicators(self.state.currentStep);
        
        // Special handling for confirmation step
        if (self.state.currentStep === 4) {
          self.dom.renderConfirmation();
        }
      }
    },

    prevStep: function() {
      const self = window.BookingSystem;
      if (self.state.currentStep > 1) {
        self.state.currentStep--;
        self.dom.showStep(self.state.currentStep);
        self.dom.updateStepIndicators(self.state.currentStep);
      }
    },

    submitBooking: async function() {
      const self = window.BookingSystem;
      
      try {
        // Collect final data
        self.collectStepData(3);
        
        // Final validation
        if (!self.validation.validateStep(3)) {
          self.dom.showStatus('Please fill in all required information.', true);
          return;
        }
        
        // Prepare submission data
        const submissionData = {
          service: self.state.selectedService,
          option: self.state.selectedOption,
          ...self.state.bookingData
        };
        
        self.dom.showStatus('Submitting booking...');
        
        // Submit to API
        const response = await fetch('/.netlify/functions/submitBooking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData)
        });
        
        if (response.ok) {
          self.dom.showStatus('Booking submitted successfully! We will contact you soon.');
          self.resetForm();
        } else {
          throw new Error('Failed to submit booking');
        }
      } catch (error) {
        console.error('Booking submission error:', error);
        self.dom.showStatus('Failed to submit booking. Please try again.', true);
      }
    }
  },

  // Utility methods
  collectStepData: function(stepNumber) {
    const bookingData = this.state.bookingData;
    
    switch(stepNumber) {
      case 1:
        bookingData.service = this.state.selectedService;
        bookingData.option = this.state.selectedOption;
        break;
      case 2:
        const dateInput = document.getElementById('date');
        const timeInput = document.getElementById('time');
        if (dateInput) bookingData.date = dateInput.value;
        if (timeInput) bookingData.time = timeInput.value;
        break;
      case 3:
        const nameInput = document.getElementById('name');
        const phoneInput = document.getElementById('phone');
        const emailInput = document.getElementById('email');
        if (nameInput) bookingData.name = nameInput.value;
        if (phoneInput) bookingData.phone = phoneInput.value;
        if (emailInput) bookingData.email = emailInput.value;
        break;
    }
  },

  resetForm: function() {
    this.state = {
      currentStep: 1,
      selectedCategory: 'pmu',
      selectedService: null,
      selectedOption: null,
      bookingData: {
        service: '',
        option: '',
        date: '',
        time: '',
        name: '',
        phone: '',
        email: ''
      }
    };
    
    // Reset UI
    this.dom.showStep(1);
    this.dom.updateStepIndicators(1);
    this.dom.renderServices('pmu');
    
    // Reset form inputs
    document.querySelectorAll('.field-input').forEach(input => {
      input.value = '';
    });
  },

  // Initialize the booking system
  init: function() {
    console.log('Initializing BookingSystem...');
    
    // Initial setup
    this.dom.showStep(1);
    this.dom.updateStepIndicators(1);
    this.dom.renderServices(this.state.selectedCategory);
    
    // Event listeners setup
    this.setupEventListeners();
    
    console.log('BookingSystem initialized successfully');
  },

  setupEventListeners: function() {
    const self = this;
    
    // Tab switching
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('tab-btn')) {
        const category = e.target.dataset.tab;
        self.handlers.switchTab(category);
      }
    });
    
    // Service selection
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('service-btn')) {
        const serviceName = e.target.dataset.service;
        self.handlers.selectService(serviceName);
      }
    });
    
    // Modal actions
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('select-option')) {
        self.handlers.selectOption();
      }
      if (e.target.classList.contains('close-modal')) {
        self.handlers.closeModal();
      }
    });
    
    // Step navigation
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('next-btn')) {
        self.handlers.nextStep();
      }
      if (e.target.classList.contains('prev-btn')) {
        self.handlers.prevStep();
      }
      if (e.target.classList.contains('submit-btn')) {
        self.handlers.submitBooking();
      }
    });
    
    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
      const modal = document.getElementById('service-modal');
      if (e.target === modal) {
        self.handlers.closeModal();
      }
    });
    
    // Real-time validation
    document.addEventListener('input', function(e) {
      if (e.target.classList.contains('field-input')) {
        self.validateField(e.target);
      }
    });
  },

  validateField: function(field) {
    const value = field.value;
    let isValid = true;
    
    switch(field.type) {
      case 'email':
        isValid = this.validation.isValidEmail(value);
        break;
      case 'tel':
        isValid = this.validation.isValidPhone(value);
        break;
      case 'text':
        if (field.id === 'name') {
          isValid = this.validation.isValidName(value);
        }
        break;
      case 'date':
        isValid = this.validation.isValidDate(value);
        break;
    }
    
    // Visual feedback
    field.style.borderColor = isValid ? '#10b981' : '#ef4444';
  }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    window.BookingSystem.init();
  });
} else {
  window.BookingSystem.init();
}