/**
 * Main application initialization
 * Central initialization file that coordinates all app functionality
 */

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializing application...");
    
    // Initialize the editor first (ensures editor is available for preview)
    window.editor = ace.edit("editor");
    window.editor.setTheme("ace/theme/monokai");
    window.editor.session.setMode("ace/mode/html");
    
    console.log("Editor initialized");
    
    // Set default template if not already set
    if (!window.editor.getValue()) {
        console.log("Setting default template");
        window.editor.setValue(defaultTemplate);
        window.editor.clearSelection();
    }
    
    // Initialize UI components
    initResizer();
    initViewButtons();
    
    // Initialize template data
    initTemplateElements();
    initLiquidVariables();
    initLiquidBlocks();
    
    // Initialize modals
    initModals();
    
    // Add keyboard shortcuts and auto-completion to editor
    enhanceAceEditor();
    
    // Set up the editor change event listener
    window.editor.session.on('change', function() {
        updatePreview();
    });
    
    // Initial preview update
    console.log("Updating preview...");
    setTimeout(updatePreview, 1000); // Longer delay to ensure everything is ready
    
    console.log("Initialization complete");
});