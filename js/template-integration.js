/**
 * Enhanced Editor Integration
 * 
 * This file provides additional functionality to better integrate
 * the code editor with the WYSIWYG editor, improving the user experience
 * when working with Shopify email templates.
 */

// Add helper functions for converting between editors
document.addEventListener('DOMContentLoaded', function() {
  // Wait for both editors to be initialized
  const checkEditorsReady = setInterval(function() {
    if (window.ace && window.quillEditor) {
      clearInterval(checkEditorsReady);
      enhanceEditorIntegration();
    }
  }, 100);
  
  // Set timeout to avoid infinite checking
  setTimeout(function() {
    clearInterval(checkEditorsReady);
  }, 10000);
});

function enhanceEditorIntegration() {
  // Add format cleaner button to toolbar
  addFormatCleanerButton();
  
  // Add auto-sync toggle
  addAutoSyncToggle();
  
  // Add help button for editor usage
  addEditorHelpButton();
  
  // Enhance preview button to work better with WYSIWYG
  enhancePreviewButton();
}

// Add format cleaner button to Quill toolbar
function addFormatCleanerButton() {
  const qlToolbar = document.querySelector('.ql-toolbar');
  
  if (qlToolbar && !document.getElementById('format-cleaner-btn')) {
    // Add separator
    const separator = document.createElement('span');
    separator.className = 'ql-formats';
    qlToolbar.appendChild(separator);
    
    // Create cleaner button
    const cleanerBtn = document.createElement('button');
    cleanerBtn.id = 'format-cleaner-btn';
    cleanerBtn.className = 'ql-clean-format';
    cleanerBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path fill="currentColor" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"></path>
      </svg>
    `;
    cleanerBtn.title = 'Clean Formatting';
    
    // Add click event
    cleanerBtn.addEventListener('click', function() {
      cleanFormatting();
    });
    
    qlToolbar.appendChild(cleanerBtn);
  }
}

// Clean formatting in the WYSIWYG editor
function cleanFormatting() {
  if (!quillEditor) return;
  
  // Get selection or use entire document
  const range = quillEditor.getSelection() || { index: 0, length: quillEditor.getLength() };
  
  // Get text content only
  const text = quillEditor.getText(range.index, range.length);
  
  // Remove formatting but preserve Liquid tags
  const content = quillEditor.root.innerHTML;
  
  // Extract Liquid tags
  const liquidTags = [];
  let match;
  
  // Extract {{ variable }} tags
  const varRegex = /{{\s*([^}]*)}}/g;
  while ((match = varRegex.exec(content)) !== null) {
    liquidTags.push({
      tag: match[0],
      index: match.index
    });
  }
  
  // Extract {% control %} tags
  const controlRegex = /{%\s*([^%}]*)\s*%}/g;
  while ((match = controlRegex.exec(content)) !== null) {
    liquidTags.push({
      tag: match[0],
      index: match.index
    });
  }
  
  // Delete the content
  quillEditor.deleteText(range.index, range.length);
  
  // Insert the plain text
  quillEditor.insertText(range.index, text, 'api');
  
  // Re-insert the Liquid tags (simplified approach)
  processLiquidTags();
  
  // Update code editor
  syncToCodeEditor();
  
  // Show confirmation toast
  showToast('Formatting cleaned successfully!');
}

// Add auto-sync toggle
function addAutoSyncToggle() {
  const rightPanel = document.getElementById('right-panel');
  const toggleContainer = document.createElement('div');
  toggleContainer.className = 'mb-2 flex items-center justify-end text-sm';
  
  toggleContainer.innerHTML = `
    <label class="flex items-center cursor-pointer">
      <span class="mr-2 text-gray-700">Auto-Sync Editors</span>
      <div class="relative">
        <input type="checkbox" id="auto-sync-toggle" class="sr-only" checked>
        <div class="block bg-gray-300 w-10 h-6 rounded-full"></div>
        <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
      </div>
    </label>
  `;
  
  // Insert before the editor toggle buttons
  const editorToggleButtons = document.querySelector('#right-panel > div.mb-2.flex.space-x-2');
  if (editorToggleButtons) {
    rightPanel.insertBefore(toggleContainer, editorToggleButtons);
  } else {
    // Fallback insertion
    const firstElement = rightPanel.firstElementChild;
    if (firstElement) {
      rightPanel.insertBefore(toggleContainer, firstElement.nextSibling);
    }
  }
  
  // Add toggle functionality
  const toggle = document.getElementById('auto-sync-toggle');
  const dot = toggleContainer.querySelector('.dot');
  
  toggle.addEventListener('change', function() {
    if (this.checked) {
      dot.classList.add('transform', 'translate-x-4');
      window.autoSyncEnabled = true;
    } else {
      dot.classList.remove('transform', 'translate-x-4');
      window.autoSyncEnabled = false;
    }
  });
  
  // Initialize the toggle position
  if (toggle.checked) {
    dot.classList.add('transform', 'translate-x-4');
    window.autoSyncEnabled = true;
  }
  
  // Add styles for the toggle
  const style = document.createElement('style');
  style.textContent = `
    .dot {
      transition: transform 0.3s ease-in-out;
    }
    #auto-sync-toggle:checked ~ .dot {
      transform: translateX(1rem);
    }
  `;
  document.head.appendChild(style);
}

// Add help button for editor usage
function addEditorHelpButton() {
  const rightPanel = document.getElementById('right-panel');
  const helpButton = document.createElement('button');
  helpButton.className = 'absolute top-2 right-2 text-gray-500 hover:text-gray-700';
  helpButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
    </svg>
  `;
  helpButton.title = 'Editor Help';
  
  // Set relative position on the container
  rightPanel.style.position = 'relative';
  
  // Add button to panel
  rightPanel.appendChild(helpButton);
  
  // Add click event to show help modal
  helpButton.addEventListener('click', showEditorHelpModal);
  
  // Create help modal
  createEditorHelpModal();
}

// Create editor help modal
function createEditorHelpModal() {
  // Check if modal already exists
  if (document.getElementById('editor-help-modal')) {
    return;
  }
  
  // Create modal container
  const modal = document.createElement('div');
  modal.id = 'editor-help-modal';
  modal.className = 'hidden fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-labelledby', 'editor-help-title');
  modal.setAttribute('aria-modal', 'true');
  
  // Create modal content
  modal.innerHTML = `
    <div class="relative mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
      <div class="flex justify-between items-center mb-4">
        <h3 id="editor-help-title" class="text-lg font-medium">Editor Help</h3>
        <button class="close-modal text-gray-400 hover:text-gray-500" aria-label="Close modal">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <div class="space-y-4">
        <div>
          <h4 class="font-bold">Switching Editors</h4>
          <p>Use the "Code Editor" and "Visual Editor" buttons to switch between HTML code view and the visual editor.</p>
        </div>
        <div>
          <h4 class="font-bold">Working with Liquid Tags</h4>
          <p>Liquid tags appear as highlighted blocks in the visual editor. They are protected from editing to prevent syntax errors.</p>
          <p>To add Liquid variables, use the "Liquid Variables" button in the top menu.</p>
        </div>
        <div>
          <h4 class="font-bold">Email Components</h4>
          <p>Use the components button in the toolbar to insert pre-designed email elements like buttons, dividers, and layouts.</p>
        </div>
        <div>
          <h4 class="font-bold">Template Elements</h4>
          <p>Click "Insert Template Element" to add Shopify-specific email components like order details and shipping information.</p>
        </div>
        <div>
          <h4 class="font-bold">Preview</h4>
          <p>Use the "Update Preview" button to see how your email will look. Toggle between desktop and mobile views.</p>
        </div>
      </div>
    </div>
  `;
  
  // Add modal to document
  document.body.appendChild(modal);
  
  // Add event listeners
  modal.querySelector('.close-modal').addEventListener('click', function() {
    modal.classList.add('hidden');
  });
  
  // Close when clicking outside
  modal.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.classList.add('hidden');
    }
  });
}

// Show editor help modal
function showEditorHelpModal() {
  const modal = document.getElementById('editor-help-modal');
  if (modal) {
    modal.classList.remove('hidden');
  }
}

// Enhance preview button to work better with WYSIWYG
function enhancePreviewButton() {
  const previewBtn = document.getElementById('preview-btn');
  if (!previewBtn) return;
  
  // Replace the click event
  const originalClick = previewBtn.onclick;
  previewBtn.onclick = function(e) {
    // If we're in WYSIWYG mode, first sync content to code editor
    if (document.getElementById('wysiwyg-editor') && 
        document.getElementById('wysiwyg-editor').style.display !== 'none' && 
        quillEditor) {
      syncToCodeEditor();
    }
    
    // Call original handler if it exists
    if (typeof originalClick === 'function') {
      originalClick.call(this, e);
    } else {
      // Fallback to calling updatePreview directly
      updatePreview();
    }
    
    // Show confirmation toast
    showToast('Preview updated!');
  };
}

// Show toast message
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  // Set message
  toast.textContent = message;
  
  // Set color based on type
  toast.className = 'toast fixed bottom-4 right-4 text-white p-4 rounded shadow-lg';
  
  if (type === 'success') {
    toast.classList.add('bg-green-500');
  } else if (type === 'error') {
    toast.classList.add('bg-red-500');
  } else if (type === 'info') {
    toast.classList.add('bg-blue-500');
  }
  
  // Show toast
  toast.classList.remove('hidden');
  
  // Hide after 3 seconds
  setTimeout(function() {
    toast.classList.add('hidden');
  }, 3000);
}

// Override the original syncToCodeEditor function to respect auto-sync setting
const originalSyncToCodeEditor = window.syncToCodeEditor;
window.syncToCodeEditor = function() {
  if (window.autoSyncEnabled !== false) {
    originalSyncToCodeEditor();
  }
};

// Override the original syncToWysiwygEditor function to respect auto-sync setting
const originalSyncToWysiwygEditor = window.syncToWysiwygEditor;
window.syncToWysiwygEditor = function() {
  if (window.autoSyncEnabled !== false) {
    originalSyncToWysiwygEditor();
  }
};