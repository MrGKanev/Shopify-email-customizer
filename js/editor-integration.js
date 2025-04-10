/**
 * Editor Integration
 * 
 * This file handles the interaction between the code editor (Ace) and WYSIWYG editor.
 * It modifies the panel layout to place the visual editor at the top by default.
 */

document.addEventListener('DOMContentLoaded', function() {
  // Rearrange the template elements button to appear below the editor toggle
  // We'll wait for the editor toggle to be added by the WYSIWYG editor
  const checkToggleButton = setInterval(function() {
    const codeEditorBtn = document.getElementById('code-editor-btn');
    if (codeEditorBtn) {
      clearInterval(checkToggleButton);
      rearrangeEditorButtons();
    }
  }, 100);
  
  // Set timeout to avoid infinite checking
  setTimeout(function() {
    clearInterval(checkToggleButton);
  }, 5000);
  
  // Update preview button to handle WYSIWYG editor
  updatePreviewButton();
});

// Rearrange editor buttons for better UX
function rearrangeEditorButtons() {
  const rightPanel = document.getElementById('right-panel');
  const templateButtonDiv = document.getElementById('template-elements-btn').parentNode;
  const toggleContainer = document.getElementById('code-editor-btn').parentNode;
  
  // Move the template elements button below the toggle buttons
  if (rightPanel && templateButtonDiv && toggleContainer) {
    // Check if we need to rearrange
    if (templateButtonDiv.nextElementSibling === toggleContainer) {
      // Already in the right order, do nothing
      return;
    }
    
    // Move the toggle buttons before the template button
    rightPanel.insertBefore(toggleContainer, templateButtonDiv);
    
    // Add some spacing between the buttons
    const spacer = document.createElement('div');
    spacer.className = 'mb-2';
    rightPanel.insertBefore(spacer, templateButtonDiv);
  }
}

// Update the preview button to work properly with the WYSIWYG editor
function updatePreviewButton() {
  const previewBtn = document.getElementById('preview-btn');
  if (!previewBtn) return;
  
  // Preserve the original click handler
  const originalClick = previewBtn.onclick;
  
  // Override with our enhanced handler
  previewBtn.onclick = function() {
    // Ensure we sync from WYSIWYG to code before updating preview
    // This check will be handled internally by the updatePreview function
    // that was modified in wysiwyg-editor.js
    
    // Call original or default update preview function
    if (typeof originalClick === 'function') {
      originalClick.call(this);
    } else if (typeof window.updatePreview === 'function') {
      window.updatePreview();
    }
  };
}