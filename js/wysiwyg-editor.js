/**
 * Improved WYSIWYG Editor for Shopify Email Customizer
 * 
 * This implementation loads the visual editor first and ensures
 * the template design stays intact without breaking.
 */

// Global variables
let quillEditor;
let isUpdatingFromWysiwyg = false;
let isUpdatingFromCodeEditor = false;
let editorInitialized = false;

// Add Quill editor scripts and styles to the head
document.addEventListener('DOMContentLoaded', function() {
  // Add Quill CSS
  const quillCSS = document.createElement('link');
  quillCSS.rel = 'stylesheet';
  quillCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.snow.min.css';
  document.head.appendChild(quillCSS);
  
  // Add Quill script
  const quillScript = document.createElement('script');
  quillScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.min.js';
  document.head.appendChild(quillScript);
  
  // Initialize WYSIWYG editor when Quill is loaded
  quillScript.onload = function() {
    // Create editor first but don't initialize Quill immediately
    setupEditorContainer();
    
    // Wait a short delay to ensure default template is loaded in the code editor
    setTimeout(initWysiwygEditor, 300);
  };
});

// Setup the editor container without initializing Quill
function setupEditorContainer() {
  // Create the editor container if it doesn't exist
  let editorContainer = document.getElementById('wysiwyg-editor');
  if (!editorContainer) {
    editorContainer = document.createElement('div');
    editorContainer.id = 'wysiwyg-editor';
    editorContainer.style.display = 'block'; // Show WYSIWYG editor by default
    
    // Create editor components
    const editorToolbar = document.createElement('div');
    editorToolbar.id = 'quill-toolbar';
    
    const editorContent = document.createElement('div');
    editorContent.id = 'quill-editor';
    editorContent.style.height = 'calc(100vh - 12rem)';
    editorContent.style.overflowY = 'auto';
    
    editorContainer.appendChild(editorToolbar);
    editorContainer.appendChild(editorContent);
    
    // Add the WYSIWYG editor at the top of the right panel
    const rightPanel = document.getElementById('right-panel');
    if (rightPanel) {
      // Insert before the first child
      rightPanel.insertBefore(editorContainer, rightPanel.firstChild);
      
      // Hide the code editor initially
      const codeEditor = document.getElementById('editor');
      if (codeEditor) {
        codeEditor.style.display = 'none';
      }
    } else {
      console.error('Right panel not found. Cannot initialize WYSIWYG editor.');
      return;
    }
  }
  
  // Add editor toggle buttons
  addEditorToggle();
}

// Initialize WYSIWYG Editor
function initWysiwygEditor() {
  // Make sure Quill is available
  if (typeof Quill === 'undefined') {
    console.error('Quill library not loaded. Please check the script tag.');
    return;
  }
  
  try {
    // Initialize Quill with simpler toolbar options
    quillEditor = new Quill('#quill-editor', {
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote'],
          [{ 'header': 1 }, { 'header': 2 }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'align': [] }],
          ['clean']
        ]
      },
      theme: 'snow'
    });
    
    // Mark as initialized
    editorInitialized = true;
    
    // Disable the text-change Quill event that causes issues
    quillEditor.off('text-change');
    
    // Add safe, debounced change handler
    quillEditor.on('text-change', function(delta, oldContents, source) {
      // Only update if change was made by user, not programmatically
      if (source === 'user' && !isUpdatingFromCodeEditor) {
        // Use debounce to prevent rapid updates
        clearTimeout(window.quillChangeTimeout);
        window.quillChangeTimeout = setTimeout(function() {
          if (!isUpdatingFromCodeEditor) {
            safeUpdateCodeEditor();
          }
        }, 1000); // Longer delay to prevent constant updates
      }
    });
    
    // Load the content from code editor to WYSIWYG
    loadContentIntoEditor();
    
    // Dispatch event so other components know Quill is ready
    document.dispatchEvent(new Event('quillReady'));
    
    console.log('WYSIWYG editor initialized successfully');
  } catch (error) {
    console.error('Error initializing Quill editor:', error);
  }
}

// Load content into the editor
function loadContentIntoEditor() {
  try {
    // Wait for ACE editor to be fully initialized 
    if (!ace || !ace.edit('editor')) {
      setTimeout(loadContentIntoEditor, 200);
      return;
    }
    
    // Prepare loading state
    isUpdatingFromCodeEditor = true;
    
    // Get default template HTML from the code editor
    const codeEditor = ace.edit('editor');
    const defaultTemplate = codeEditor.getValue();
    
    // Add placeholder content to Quill to indicate loading
    quillEditor.setText('Loading template...');
    
    // Extract and insert the HTML into the WYSIWYG editor safely
    setTimeout(function() {
      try {
        // Get the body content
        const bodyContent = extractBodyContent(defaultTemplate);
        
        // First load - treat liquid tags carefully
        quillEditor.setText(''); // Clear existing content
        quillEditor.clipboard.dangerouslyPasteHTML(0, bodyContent);
        
        // Initialize liquid CSS styles
        addLiquidStyles();
        
        console.log('Template loaded successfully into WYSIWYG editor');
      } catch (e) {
        console.error('Error processing template:', e);
        // Fallback to simple text if there's an error
        quillEditor.setText('Error loading template. Please check console for details.');
      } finally {
        // Reset loading state
        isUpdatingFromCodeEditor = false;
      }
    }, 500);
  } catch (error) {
    console.error('Error in loadContentIntoEditor:', error);
    isUpdatingFromCodeEditor = false;
  }
}

// Add liquid tag styles
function addLiquidStyles() {
  if (document.getElementById('liquid-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'liquid-styles';
  style.textContent = `
    .ql-liquid {
      display: inline-block;
      padding: 2px 4px;
      border-radius: 3px;
      font-family: monospace;
      user-select: all;
    }
    .ql-liquid[data-liquid-type="variable"] {
      background-color: #e0f7fa;
      color: #0277bd;
    }
    .ql-liquid[data-liquid-type="control"] {
      background-color: #fff9c4;
      color: #827717;
    }
  `;
  document.head.appendChild(style);
}

// Add toggle buttons to switch between WYSIWYG and code editor
function addEditorToggle() {
  const container = document.createElement('div');
  container.className = 'mb-2 flex space-x-2';
  
  // Create toggle buttons
  const codeBtn = document.createElement('button');
  codeBtn.id = 'code-editor-btn';
  codeBtn.className = 'px-3 py-1 border rounded hover:bg-gray-300'; // Not selected by default
  codeBtn.textContent = 'Code Editor';
  
  const wysiwygBtn = document.createElement('button');
  wysiwygBtn.id = 'wysiwyg-editor-btn';
  wysiwygBtn.className = 'px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300'; // Selected by default
  wysiwygBtn.textContent = 'Visual Editor';
  
  // Add event listeners
  codeBtn.addEventListener('click', function() {
    safeToggleEditor('code');
  });
  
  wysiwygBtn.addEventListener('click', function() {
    safeToggleEditor('wysiwyg');
  });
  
  // Add buttons to container
  container.appendChild(codeBtn);
  container.appendChild(wysiwygBtn);
  
  // Insert container right after the h2 title
  const rightPanel = document.getElementById('right-panel');
  const editorTitle = rightPanel.querySelector('h2');
  if (editorTitle && editorTitle.nextSibling) {
    rightPanel.insertBefore(container, editorTitle.nextSibling);
  } else {
    // Fallback insertion
    rightPanel.insertBefore(container, rightPanel.firstChild.nextSibling);
  }
}

// Safe toggle editor function
function safeToggleEditor(type) {
  try {
    toggleEditor(type);
  } catch (error) {
    console.error('Error toggling editor:', error);
    showToast('Error toggling editor. Please try again.', 'error');
  }
}

// Toggle between editors
function toggleEditor(type) {
  const codeEditor = document.getElementById('editor');
  const wysiwygContainer = document.getElementById('wysiwyg-editor');
  const codeBtn = document.getElementById('code-editor-btn');
  const wysiwygBtn = document.getElementById('wysiwyg-editor-btn');
  
  if (!codeEditor || !wysiwygContainer) {
    console.error('Editor elements not found');
    return;
  }
  
  try {
    if (type === 'wysiwyg') {
      // Check if editor is initialized
      if (!editorInitialized) {
        // Wait for editor to initialize
        showToast('Visual editor is still loading. Please wait...', 'info');
        return;
      }
      
      // Only sync if we have a quill editor instance
      if (quillEditor) {
        // Update Quill content from code editor if it's currently visible
        if (codeEditor.style.display === 'block') {
          safeUpdateWysiwygEditor();
        }
        
        // Show WYSIWYG editor, hide code editor
        codeEditor.style.display = 'none';
        wysiwygContainer.style.display = 'block';
      } else {
        console.error('Quill editor not initialized');
        return;
      }
    } else {
      // If we're already showing the code editor, do nothing
      if (codeEditor.style.display !== 'none') {
        return;
      }
      
      // Update code editor from Quill if needed
      safeUpdateCodeEditor();
      
      // Show code editor, hide WYSIWYG editor
      codeEditor.style.display = 'block';
      wysiwygContainer.style.display = 'none';
      
      // Make sure Ace editor refreshes
      const aceEditor = ace.edit('editor');
      if (aceEditor) {
        aceEditor.resize();
      }
    }
    
    // Update button states
    if (codeBtn && wysiwygBtn) {
      if (type === 'wysiwyg') {
        codeBtn.classList.remove('bg-gray-200');
        wysiwygBtn.classList.add('bg-gray-200');
      } else {
        codeBtn.classList.add('bg-gray-200');
        wysiwygBtn.classList.remove('bg-gray-200');
      }
    }
  } catch (error) {
    console.error('Error toggling editors:', error);
    throw error;
  }
}

// Safely extract body content from full HTML
function extractBodyContent(html) {
  if (!html) return '';
  
  try {
    const bodyRegex = /<body[^>]*>([\s\S]*?)<\/body>/i;
    const bodyMatch = bodyRegex.exec(html);
    
    if (bodyMatch && bodyMatch[1]) {
      return bodyMatch[1];
    }
    
    // If there's no body tag, return the entire HTML except for any head section
    const headRegex = /<head[^>]*>[\s\S]*?<\/head>/i;
    return html.replace(headRegex, '');
  } catch (error) {
    console.error('Error extracting body content:', error);
    return html; // Return original content as fallback
  }
}

// Safe update of WYSIWYG editor from code editor
function safeUpdateWysiwygEditor() {
  if (!quillEditor || !editorInitialized) return;
  
  try {
    isUpdatingFromCodeEditor = true;
    
    // Get content from Ace editor
    const html = ace.edit('editor').getValue();
    
    // Extract body content 
    const bodyContent = extractBodyContent(html);
    
    // Clear existing content
    quillEditor.setText('');
    
    // Insert safely using clipboard API
    quillEditor.clipboard.dangerouslyPasteHTML(0, bodyContent);
    
    console.log('Updated WYSIWYG editor successfully');
  } catch (error) {
    console.error('Error updating WYSIWYG editor:', error);
  } finally {
    // Reset flag with delay
    setTimeout(() => {
      isUpdatingFromCodeEditor = false;
    }, 100);
  }
}

// Safe update of code editor from WYSIWYG editor
function safeUpdateCodeEditor() {
  if (!quillEditor || !editorInitialized) return;
  
  try {
    isUpdatingFromWysiwyg = true;
    
    // Get the full HTML template from Ace editor
    const html = ace.edit('editor').getValue();
    
    // Get content from Quill
    let content = quillEditor.root.innerHTML;
    
    // Check if the HTML has a proper structure
    if (/<body[^>]*>[\s\S]*<\/body>/i.test(html)) {
      // Replace only the body content
      const newHtml = html.replace(
        /(<body[^>]*>)([\s\S]*)(<\/body>)/i,
        `$1${content}$3`
      );
      ace.edit('editor').setValue(newHtml);
    } else {
      // Just set the new content
      ace.edit('editor').setValue(content);
    }
    
    console.log('Updated code editor successfully');
  } catch (error) {
    console.error('Error updating code editor:', error);
  } finally {
    // Reset flag with delay
    setTimeout(() => {
      isUpdatingFromWysiwyg = false;
    }, 100);
  }
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

// Override the original updatePreview function to handle WYSIWYG integration
const originalUpdatePreview = window.updatePreview;
window.updatePreview = function() {
  // If we're in WYSIWYG mode and not already updating from WYSIWYG, sync content
  if (!isUpdatingFromWysiwyg && 
      document.getElementById('wysiwyg-editor') && 
      document.getElementById('wysiwyg-editor').style.display !== 'none' && 
      quillEditor && 
      editorInitialized) {
    safeUpdateCodeEditor();
  }
  
  // Call the original updatePreview function
  if (typeof originalUpdatePreview === 'function') {
    originalUpdatePreview();
  }
};

// Modify the template elements handler for WYSIWYG integration
const originalInitTemplateElements = window.initTemplateElements;
window.initTemplateElements = function() {
  // Call the original function
  if (typeof originalInitTemplateElements === 'function') {
    originalInitTemplateElements();
  }
  
  // Update handlers for WYSIWYG editor mode
  const container = document.getElementById('template-elements-container');
  if (!container) return;
  
  const items = container.querySelectorAll('.template-element-item');
  items.forEach(item => {
    // Get the original click handler
    const originalClickHandler = item.onclick;
    
    // Replace with new handler that checks editor mode
    item.onclick = function(e) {
      const wysiwygVisible = document.getElementById('wysiwyg-editor').style.display !== 'none';
      
      if (wysiwygVisible && quillEditor && editorInitialized) {
        // Get the element ID
        const elementId = this.dataset.elementId;
        const template = window.templateElements && window.templateElements.find(t => t.id === elementId);
        
        if (template) {
          try {
            // Insert at cursor position in Quill safely
            const range = quillEditor.getSelection(true) || { index: 0, length: 0 };
            quillEditor.clipboard.dangerouslyPasteHTML(range.index, template.code);
            
            // Close modal
            document.getElementById('template-elements-modal').classList.add('hidden');
            
            // Update preview
            safeUpdateCodeEditor();
            if (typeof originalUpdatePreview === 'function') {
              originalUpdatePreview();
            }
          } catch (error) {
            console.error('Error inserting template element:', error);
          }
        }
      } else {
        // Use original handler for code editor
        if (typeof originalClickHandler === 'function') {
          originalClickHandler.call(this, e);
        }
      }
    };
  });
};

// Similar modification for liquid variables
const originalInitLiquidVariables = window.initLiquidVariables;
window.initLiquidVariables = function() {
  // Call the original function
  if (typeof originalInitLiquidVariables === 'function') {
    originalInitLiquidVariables();
  }
  
  // Update handlers for WYSIWYG editor mode
  const container = document.getElementById('liquid-vars-container');
  if (!container) return;
  
  const items = container.querySelectorAll('.liquid-var-item');
  items.forEach(item => {
    // Get the original click handler
    const originalClickHandler = item.onclick;
    
    // Replace with new handler that checks editor mode
    item.onclick = function(e) {
      const wysiwygVisible = document.getElementById('wysiwyg-editor').style.display !== 'none';
      
      if (wysiwygVisible && quillEditor && editorInitialized) {
        // Get the liquid variable code
        const codeElement = this.querySelector('code');
        if (!codeElement) return;
        
        const liquidCode = codeElement.textContent;
        
        try {
          // Create a span element for the liquid tag
          const range = quillEditor.getSelection(true) || { index: 0, length: 0 };
          quillEditor.clipboard.dangerouslyPasteHTML(range.index, liquidCode);
          
          // Close modal
          document.getElementById('liquid-vars-modal').classList.add('hidden');
          
          // Sync to code editor
          safeUpdateCodeEditor();
        } catch (error) {
          console.error('Error inserting liquid variable:', error);
        }
      } else {
        // Use original handler for code editor
        if (typeof originalClickHandler === 'function') {
          originalClickHandler.call(this, e);
        }
      }
    };
  });
};

// Similar modification for liquid blocks
const originalInitLiquidBlocks = window.initLiquidBlocks;
window.initLiquidBlocks = function() {
  // Call the original function
  if (typeof originalInitLiquidBlocks === 'function') {
    originalInitLiquidBlocks();
  }
  
  // Update handlers for WYSIWYG editor mode
  const container = document.getElementById('liquid-blocks-container');
  if (!container) return;
  
  const items = container.querySelectorAll('.liquid-block-item');
  items.forEach(item => {
    // Get the original click handler
    const originalClickHandler = item.onclick;
    
    // Replace with new handler that checks editor mode
    item.onclick = function(e) {
      const wysiwygVisible = document.getElementById('wysiwyg-editor').style.display !== 'none';
      
      if (wysiwygVisible && quillEditor && editorInitialized) {
        // Get the liquid block code
        const preElement = this.querySelector('pre');
        if (!preElement) return;
        
        const liquidCode = preElement.textContent;
        
        try {
          // Get cursor position
          const range = quillEditor.getSelection(true) || { index: 0, length: 0 };
          
          // Insert the code directly without formatting - simpler approach
          quillEditor.clipboard.dangerouslyPasteHTML(range.index, liquidCode);
          
          // Close modal
          document.getElementById('liquid-blocks-modal').classList.add('hidden');
          
          // Sync to code editor
          safeUpdateCodeEditor();
        } catch (error) {
          console.error('Error inserting liquid block:', error);
        }
      } else {
        // Use original handler for code editor
        if (typeof originalClickHandler === 'function') {
          originalClickHandler.call(this, e);
        }
      }
    };
  });
};