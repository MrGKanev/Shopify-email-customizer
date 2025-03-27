/**
 * Main application initialization
 */

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize template data
    initTemplateElements();
    initLiquidVariables();
    initLiquidBlocks();
    
    // Initialize UI components
    initModals();
    initResizer();
    initViewButtons();
    
    // Initial preview update
    updatePreview();
});