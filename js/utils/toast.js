/**
 * Toast notification utility
 * Provides a centralized way to show toast messages across the application
 */
const Toast = {
  // Toast element reference
  element: null,
  
  // Default timeout in milliseconds
  defaultTimeout: 3000,
  
  // Timer reference
  timer: null,
  
  // Initialize the toast
  init: function() {
    this.element = document.getElementById('toast');
    return this;
  },
  
  // Show a toast message
  show: function(message, type = 'success', timeout = this.defaultTimeout) {
    if (!this.element) {
      this.init();
    }
    
    // Clear any existing timer
    if (this.timer) {
      clearTimeout(this.timer);
    }
    
    // Set message
    this.element.textContent = message;
    
    // Reset classes
    this.element.className = 'toast fixed bottom-4 right-4 text-white p-4 rounded shadow-lg';
    
    // Apply type-based styling
    switch (type) {
      case 'success':
        this.element.classList.add('bg-green-500');
        break;
      case 'error':
        this.element.classList.add('bg-red-500');
        break;
      case 'info':
        this.element.classList.add('bg-blue-500');
        break;
      case 'warning':
        this.element.classList.add('bg-yellow-500');
        break;
      default:
        this.element.classList.add('bg-gray-700');
    }
    
    // Show toast
    this.element.classList.remove('hidden');
    
    // Auto-hide after timeout
    this.timer = setTimeout(() => {
      this.hide();
    }, timeout);
    
    return this;
  },
  
  // Hide the toast
  hide: function() {
    if (this.element) {
      this.element.classList.add('hidden');
    }
    return this;
  }
};

// Initialize toast when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  Toast.init();
});