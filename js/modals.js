/**
 * Modal functionality
 */

// Initialize modal event handlers
function initModals() {
    // Button click handlers to open modals
    const templateElementsBtn = document.getElementById('template-elements-btn');
    const liquidBlocksBtn = document.getElementById('liquid-blocks-btn');
    const liquidVarsBtn = document.getElementById('liquid-vars-btn');
    
    if (templateElementsBtn) {
        templateElementsBtn.addEventListener('click', function() {
            document.getElementById('template-elements-modal').classList.remove('hidden');
        });
    }
    
    if (liquidBlocksBtn) {
        liquidBlocksBtn.addEventListener('click', function() {
            document.getElementById('liquid-blocks-modal').classList.remove('hidden');
        });
    }
    
    if (liquidVarsBtn) {
        liquidVarsBtn.addEventListener('click', function() {
            document.getElementById('liquid-vars-modal').classList.remove('hidden');
        });
    }
    
    // Close modal buttons
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modals = document.querySelectorAll('#template-elements-modal, #liquid-blocks-modal, #liquid-vars-modal');
            modals.forEach(modal => {
                modal.classList.add('hidden');
            });
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modals = [
            'template-elements-modal',
            'liquid-blocks-modal',
            'liquid-vars-modal'
        ];
        
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal && event.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });
    
    // Save button handler
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const toast = document.getElementById('toast');
            toast.classList.remove('hidden');
            toast.textContent = 'Template saved successfully!';
            toast.classList.add('bg-green-500');
            
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 3000);
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