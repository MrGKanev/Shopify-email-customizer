/**
 * Unified modal management utility
 */
const ModalManager = {
  // Store for all registered modals
  modals: {},
  
  // Register a modal
  register: function(modalId, options = {}) {
    this.modals[modalId] = {
      element: document.getElementById(modalId),
      triggerBtn: options.triggerBtn ? document.getElementById(options.triggerBtn) : null,
      closeBtn: options.closeBtn || '.close-modal',
      onOpen: options.onOpen || null,
      onClose: options.onClose || null
    };
    
    // Set up trigger button if provided
    if (this.modals[modalId].triggerBtn) {
      this.modals[modalId].triggerBtn.addEventListener('click', () => this.open(modalId));
    }
    
    // Set up close button
    const modal = this.modals[modalId].element;
    if (modal) {
      const closeButtons = modal.querySelectorAll(this.modals[modalId].closeBtn);
      closeButtons.forEach(btn => {
        btn.addEventListener('click', () => this.close(modalId));
      });
      
      // Close on outside click
      modal.addEventListener('click', (event) => {
        if (event.target === modal) {
          this.close(modalId);
        }
      });
    }
    
    return this;
  },
  
  // Open a modal
  open: function(modalId) {
    const modal = this.modals[modalId];
    if (modal && modal.element) {
      modal.element.classList.remove('hidden');
      if (modal.onOpen) modal.onOpen();
    }
    return this;
  },
  
  // Close a modal
  close: function(modalId) {
    const modal = this.modals[modalId];
    if (modal && modal.element) {
      modal.element.classList.add('hidden');
      if (modal.onClose) modal.onClose();
    }
    return this;
  },
  
  // Close all modals
  closeAll: function() {
    Object.keys(this.modals).forEach(modalId => {
      this.close(modalId);
    });
    return this;
  }
};