/**
 * Modal functionality
 */

// Initialize modal event handlers
function initModals() {
    // Register all modals
    ModalManager
      .register('template-elements-modal', {
        triggerBtn: 'template-elements-btn'
      })
      .register('liquid-blocks-modal', {
        triggerBtn: 'liquid-blocks-btn'
      })
      .register('liquid-vars-modal', {
        triggerBtn: 'liquid-vars-btn'
      })
      .register('editor-help-modal');
    
    // Save button handler
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            Toast.show('Template saved successfully!', 'success');
        });
    }
    
    // Minify button handler
    const minifyBtn = document.getElementById('minify-btn');
    if (minifyBtn) {
        minifyBtn.addEventListener('click', function() {
            copyMinifiedHTML();
        });
    }
    
    // Preview button click handler
    const previewBtn = document.getElementById('preview-btn');
    if (previewBtn) {
        previewBtn.addEventListener('click', function() {
            updatePreview();
        });
    }
}