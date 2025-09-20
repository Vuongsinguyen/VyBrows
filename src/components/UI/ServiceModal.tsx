// ServiceModal.tsx - Modal for detailed service information and option selection
import React, { useEffect, useRef } from 'react';
import type { Service } from '../../types/booking';

interface ServiceModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (option: string) => void;
  selectedOption: string;
}

const ServiceModal: React.FC<ServiceModalProps> = ({
  service,
  isOpen,
  onClose,
  onSelectOption,
  selectedOption
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Handle ESC key and focus management
  useEffect(() => {
    if (isOpen) {
      // Focus the close button when modal opens
      closeButtonRef.current?.focus();
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      const handleEscKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscKey);
      
      return () => {
        document.removeEventListener('keydown', handleEscKey);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, onClose]);

  // Handle click outside modal
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Handle option selection
  const handleOptionSelect = (option: string) => {
    onSelectOption(option);
    onClose();
  };

  if (!isOpen || !service) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-90vh overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 id="modal-title" className="text-xl font-bold text-green-800">
            {service.name}
          </h2>
          <button
            ref={closeButtonRef}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-full p-2"
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Service Details */}
          <div id="modal-description" className="mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-green-800 mb-2">Service Information</h3>
              <div className="text-green-700 space-y-1">
                <p><strong>Price:</strong> {service.price}</p>
                <p><strong>Duration:</strong> {service.duration || '60-90 minutes'}</p>
                <p><strong>Description:</strong> {service.description || 'Professional beauty service tailored to your needs.'}</p>
              </div>
            </div>
          </div>

          {/* Option Selection */}
          <fieldset className="mb-6">
            <legend className="text-lg font-semibold mb-4 text-green-800">
              Select Service Option
            </legend>
            
            <div className="space-y-3">
                {service.options && service.options.length > 0 ? (
                  service.options.map((opt, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md ${
                        selectedOption === opt.name
                          ? 'border-green-600 bg-green-50 text-green-800'
                          : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-25'
                      }`}
                    >
                      <input
                        type="radio"
                        name="serviceOption"
                        value={opt.name}
                        checked={selectedOption === opt.name}
                        onChange={() => onSelectOption(opt.name)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                        aria-describedby={`option-desc-${idx}`}
                      />
                      <span className="ml-3 font-medium">
                        {opt.name} {opt.time ? `- ${opt.time}` : ''}{opt.price ? ` - ${opt.price}` : ''}
                      </span>
                      <div id={`option-desc-${idx}`} className="sr-only">
                        Service option: {opt.name}
                      </div>
                    </label>
                  ))
                ) : (
                  <span>No options</span>
                )}
            </div>
          </fieldset>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <button
            className="px-4 py-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-lg transition-colors duration-300"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          
          <button
            className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
              selectedOption
                ? 'bg-green-800 text-white hover:bg-green-700 hover:transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={() => selectedOption && handleOptionSelect(selectedOption)}
            disabled={!selectedOption}
            type="button"
            aria-describedby="select-help"
          >
            Select This Option
          </button>
        </div>
        
        <div id="select-help" className="sr-only">
          Confirm your selection and return to the booking form
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;