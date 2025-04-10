/**
 * Main application initialization
 */

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the editor first (ensures editor is available for preview)
    // This is defined in editor.js
    const editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/html");
    
    // Set default template if not already set
    if (!editor.getValue()) {
        editor.setValue(defaultTemplate);
        editor.clearSelection();
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
    editor.session.on('change', function() {
        updatePreview();
    });
    
    // Initial preview update
    setTimeout(updatePreview, 500); // Small delay to ensure everything is ready
});