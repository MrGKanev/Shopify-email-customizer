/**
 * Simplified Visual Editor with Structure Preservation
 */

// Global variables
let quillEditor;
let isUpdatingFromWysiwyg = false;
let isUpdatingFromCodeEditor = false;
let editorInitialized = false;

// Initialize on document load
document.addEventListener('DOMContentLoaded', function() {
  // Create toggle buttons
  addEditorToggle();
  
  // Add Quill resources
  loadQuillResources();
});

// Load Quill JS and CSS resources
function loadQuillResources() {
  // Add Quill CSS
  const quillCSS = document.createElement('link');
  quillCSS.rel = 'stylesheet';
  quillCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.snow.min.css';
  document.head.appendChild(quillCSS);
  
  // Add Quill script
  const quillScript = document.createElement('script');
  quillScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.min.js';
  document.head.appendChild(quillScript);
  
  // Initialize editor when script loads
  quillScript.onload = function() {
    setupVisualEditor();
  };
}

// Add toggle buttons to switch between editors
function addEditorToggle() {
  const container = document.createElement('div');
  container.className = 'mb-2 flex space-x-2';
  
  // Create toggle buttons
  const codeBtn = document.createElement('button');
  codeBtn.id = 'code-editor-btn';
  codeBtn.className = 'px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300'; // Selected by default
  codeBtn.textContent = 'Code Editor';
  
  const wysiwygBtn = document.createElement('button');
  wysiwygBtn.id = 'wysiwyg-editor-btn';
  wysiwygBtn.className = 'px-3 py-1 border rounded hover:bg-gray-300'; // Not selected by default
  wysiwygBtn.textContent = 'Visual Editor';
  
  // Add event listeners
  codeBtn.addEventListener('click', function() {
    showCodeEditor();
  });
  
  wysiwygBtn.addEventListener('click', function() {
    showVisualEditor();
  });
  
  // Add buttons to container
  container.appendChild(codeBtn);
  container.appendChild(wysiwygBtn);
  
  // Insert container in the appropriate place
  const rightPanel = document.getElementById('right-panel');
  const templateButton = document.getElementById('template-elements-btn');
  
  if (rightPanel && templateButton) {
    const buttonContainer = templateButton.parentNode;
    rightPanel.insertBefore(container, buttonContainer);
  }
}

// Setup the visual editor
function setupVisualEditor() {
  // Create the container if it doesn't exist
  let editorContainer = document.getElementById('wysiwyg-editor');
  if (!editorContainer) {
    editorContainer = document.createElement('div');
    editorContainer.id = 'wysiwyg-editor';
    editorContainer.style.display = 'none'; // Hidden by default
    
    // Create editor components
    const editorToolbar = document.createElement('div');
    editorToolbar.id = 'quill-toolbar';
    
    const editorContent = document.createElement('div');
    editorContent.id = 'quill-editor';
    editorContent.style.height = 'calc(100vh - 12rem)';
    editorContent.style.overflowY = 'auto';
    
    editorContainer.appendChild(editorToolbar);
    editorContainer.appendChild(editorContent);
    
    // Add the editor container to the right panel
    const rightPanel = document.getElementById('right-panel');
    const codeEditor = document.getElementById('editor');
    
    if (rightPanel && codeEditor) {
      rightPanel.insertBefore(editorContainer, codeEditor);
    }
  }
  
  // Initialize Quill
  initializeQuill();
}

// Initialize Quill editor
function initializeQuill() {
  if (typeof Quill === 'undefined') {
    console.error('Quill library not loaded');
    return;
  }
  
  try {
    // Initialize with basic toolbar
    quillEditor = new Quill('#quill-editor', {
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ 'header': 1 }, { 'header': 2 }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['link', 'clean']
        ]
      },
      theme: 'snow'
    });
    
    // Add change handler with delay
    quillEditor.on('text-change', function(delta, oldContents, source) {
      if (source === 'user' && !isUpdatingFromCodeEditor) {
        clearTimeout(window.quillChangeTimeout);
        window.quillChangeTimeout = setTimeout(function() {
          syncToCodeEditor();
        }, 800); // Delay to prevent constant updates
      }
    });
    
    editorInitialized = true;
    console.log('Visual editor initialized');
  } catch (error) {
    console.error('Error initializing Quill editor:', error);
  }
}

// Show the code editor
function showCodeEditor() {
  const codeEditor = document.getElementById('editor');
  const visualEditor = document.getElementById('wysiwyg-editor');
  const codeBtn = document.getElementById('code-editor-btn');
  const visualBtn = document.getElementById('wysiwyg-editor-btn');
  
  if (!codeEditor || !visualEditor) return;
  
  // Sync changes from visual editor if needed
  if (visualEditor.style.display !== 'none' && quillEditor) {
    syncToCodeEditor();
  }
  
  // Update display
  codeEditor.style.display = 'block';
  visualEditor.style.display = 'none';
  
  // Update button states
  codeBtn.classList.add('bg-gray-200');
  visualBtn.classList.remove('bg-gray-200');
  
  // Resize Ace editor to fit container
  try {
    const aceEditor = ace.edit('editor');
    aceEditor.resize();
  } catch (e) {
    console.error('Error resizing code editor:', e);
  }
}

// Show the visual editor
function showVisualEditor() {
  const codeEditor = document.getElementById('editor');
  const visualEditor = document.getElementById('wysiwyg-editor');
  const codeBtn = document.getElementById('code-editor-btn');
  const visualBtn = document.getElementById('wysiwyg-editor-btn');
  
  if (!codeEditor || !visualEditor || !quillEditor) return;
  
  // Copy content from code editor to visual editor
  syncToVisualEditor();
  
  // Update display
  codeEditor.style.display = 'none';
  visualEditor.style.display = 'block';
  
  // Update button states
  codeBtn.classList.remove('bg-gray-200');
  visualBtn.classList.add('bg-gray-200');
}

// Store original code editor content
let originalContent = '';
let editTarget = 'body'; // Default target: 'body', 'selection', or 'full'

// Get selected content from code editor
function getSelectedHtmlFromAce() {
  try {
    const aceEditor = ace.edit('editor');
    const selection = aceEditor.getSelection();
    const range = selection.getRange();
    
    // If no selection, return null
    if (range.isEmpty()) {
      return null;
    }
    
    // Save selection range
    window.lastSelectionRange = range;
    
    // Get selected text
    return aceEditor.session.getTextRange(range);
  } catch (e) {
    console.error('Error getting selection:', e);
    return null;
  }
}

// Extract content for editing
function extractEditableContent(html) {
  // Store original content
  originalContent = html;
  
  // Check for selection first
  const selection = getSelectedHtmlFromAce();
  if (selection) {
    editTarget = 'selection';
    return selection;
  }
  
  // Try to extract body content if available
  const bodyMatch = /<body[^>]*>([\s\S]*?)<\/body>/i.exec(html);
  if (bodyMatch && bodyMatch[1]) {
    editTarget = 'body';
    return bodyMatch[1];
  }
  
  // Fallback to full content
  editTarget = 'full';
  return html;
}

// Sync from code editor to visual editor
function syncToVisualEditor() {
  if (!quillEditor || !editorInitialized) return;
  
  try {
    isUpdatingFromCodeEditor = true;
    
    // Get content from Ace editor
    const aceEditor = ace.edit('editor');
    const html = aceEditor.getValue();
    
    // Extract editable content
    const content = extractEditableContent(html);
    
    // Clear existing content
    quillEditor.setText('');
    
    // Set content in Quill
    quillEditor.clipboard.dangerouslyPasteHTML(0, content);
    
    console.log('Content loaded into visual editor');
  } catch (error) {
    console.error('Error updating visual editor:', error);
  } finally {
    setTimeout(() => {
      isUpdatingFromCodeEditor = false;
    }, 100);
  }
}

// Sync from visual editor to code editor
function syncToCodeEditor() {
  if (!quillEditor || !editorInitialized) return;
  
  try {
    isUpdatingFromWysiwyg = true;
    
    // Get content from visual editor
    const content = quillEditor.root.innerHTML;
    
    // Get the full HTML from the code editor
    const aceEditor = ace.edit('editor');
    
    // Update based on edit target
    if (editTarget === 'selection' && window.lastSelectionRange) {
      // Replace just the selected text
      aceEditor.session.replace(window.lastSelectionRange, content);
    } else if (editTarget === 'body') {
      // Update only the body content
      const html = originalContent || aceEditor.getValue();
      
      const newHtml = html.replace(
        /(<body[^>]*>)([\s\S]*)(<\/body>)/i,
        `$1${content}$3`
      );
      aceEditor.setValue(newHtml);
    } else {
      // Full replacement as fallback
      aceEditor.setValue(content);
    }
    
    // Update preview
    if (typeof window.updatePreview === 'function') {
      window.updatePreview();
    }
  } catch (error) {
    console.error('Error updating code editor:', error);
  } finally {
    setTimeout(() => {
      isUpdatingFromWysiwyg = false;
    }, 100);
  }
}

// Override template elements button to support visual editor
const originalInitTemplateElements = window.initTemplateElements;
window.initTemplateElements = function() {
  // Call original function
  if (typeof originalInitTemplateElements === 'function') {
    originalInitTemplateElements();
  }
  
  // Add support for visual editor
  const container = document.getElementById('template-elements-container');
  if (!container) return;
  
  const items = container.querySelectorAll('.template-element-item');
  items.forEach(item => {
    // Get original handler
    const originalHandler = item.onclick;
    
    // Replace with new handler
    item.onclick = function(e) {
      const visualEditorVisible = 
        document.getElementById('wysiwyg-editor') && 
        document.getElementById('wysiwyg-editor').style.display !== 'none';
      
      if (visualEditorVisible && quillEditor && editorInitialized) {
        // Get element code
        const elementId = this.dataset.elementId;
        const template = window.templateElements && 
          window.templateElements.find(t => t.id === elementId);
        
        if (template) {
          try {
            // Insert at cursor in visual editor
            const range = quillEditor.getSelection(true) || { index: 0, length: 0 };
            quillEditor.clipboard.dangerouslyPasteHTML(range.index, template.code);
            
            // Close modal
            document.getElementById('template-elements-modal').classList.add('hidden');
            
            // Sync to code editor
            syncToCodeEditor();
          } catch (error) {
            console.error('Error inserting template:', error);
          }
        }
      } else if (typeof originalHandler === 'function') {
        // Use original handler for code editor
        originalHandler.call(this, e);
      }
    };
  });
};

// Handle liquid variables in visual editor
const originalInitLiquidVariables = window.initLiquidVariables;
window.initLiquidVariables = function() {
  // Call original function
  if (typeof originalInitLiquidVariables === 'function') {
    originalInitLiquidVariables();
  }
  
  // Add visual editor support
  const container = document.getElementById('liquid-vars-container');
  if (!container) return;
  
  const items = container.querySelectorAll('.liquid-var-item');
  items.forEach(item => {
    // Get original handler
    const originalHandler = item.onclick;
    
    // Replace with new handler
    item.onclick = function(e) {
      const visualEditorVisible = 
        document.getElementById('wysiwyg-editor') && 
        document.getElementById('wysiwyg-editor').style.display !== 'none';
      
      if (visualEditorVisible && quillEditor && editorInitialized) {
        // Get liquid variable
        const codeElement = this.querySelector('code');
        if (!codeElement) return;
        
        const liquidCode = codeElement.textContent;
        
        try {
          // Insert at cursor position
          const range = quillEditor.getSelection(true) || { index: 0, length: 0 };
          quillEditor.clipboard.dangerouslyPasteHTML(range.index, liquidCode);
          
          // Close modal
          document.getElementById('liquid-vars-modal').classList.add('hidden');
          
          // Sync to code editor
          syncToCodeEditor();
        } catch (error) {
          console.error('Error inserting liquid variable:', error);
        }
      } else if (typeof originalHandler === 'function') {
        // Use original handler for code editor
        originalHandler.call(this, e);
      }
    };
  });
};

// Handle liquid blocks in visual editor
const originalInitLiquidBlocks = window.initLiquidBlocks;
window.initLiquidBlocks = function() {
  // Call original function
  if (typeof originalInitLiquidBlocks === 'function') {
    originalInitLiquidBlocks();
  }
  
  // Add visual editor support
  const container = document.getElementById('liquid-blocks-container');
  if (!container) return;
  
  const items = container.querySelectorAll('.liquid-block-item');
  items.forEach(item => {
    // Get original handler
    const originalHandler = item.onclick;
    
    // Replace with new handler
    item.onclick = function(e) {
      const visualEditorVisible = 
        document.getElementById('wysiwyg-editor') && 
        document.getElementById('wysiwyg-editor').style.display !== 'none';
      
      if (visualEditorVisible && quillEditor && editorInitialized) {
        // Get liquid block
        const preElement = this.querySelector('pre');
        if (!preElement) return;
        
        const liquidCode = preElement.textContent;
        
        try {
          // Insert at cursor position
          const range = quillEditor.getSelection(true) || { index: 0, length: 0 };
          quillEditor.clipboard.dangerouslyPasteHTML(range.index, liquidCode);
          
          // Close modal
          document.getElementById('liquid-blocks-modal').classList.add('hidden');
          
          // Sync to code editor
          syncToCodeEditor();
        } catch (error) {
          console.error('Error inserting liquid block:', error);
        }
      } else if (typeof originalHandler === 'function') {
        // Use original handler for code editor
        originalHandler.call(this, e);
      }
    };
  });
};