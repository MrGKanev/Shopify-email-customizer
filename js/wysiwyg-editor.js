/**
 * Simplified WYSIWYG Editor for Shopify Email Customizer
 * 
 * This is a more robust implementation that avoids the circular dependency
 * issues and better handles Liquid tags in the template.
 * 
 * MODIFIED: Visual editor is shown at the top by default without needing to toggle
 */

// Global variables
let quillEditor;
let isUpdatingFromWysiwyg = false;
let isUpdatingFromCodeEditor = false;

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
  quillScript.onload = initWysiwygEditor;
});

// Initialize WYSIWYG Editor
function initWysiwygEditor() {
  // Make sure Quill is available
  if (typeof Quill === 'undefined') {
    console.error('Quill library not loaded. Please check the script tag.');
    return;
  }
  
  // Create the editor container if it doesn't exist
  let editorContainer = document.getElementById('wysiwyg-editor');
  if (!editorContainer) {
    editorContainer = document.createElement('div');
    editorContainer.id = 'wysiwyg-editor';
    // MODIFIED: Show WYSIWYG editor by default
    editorContainer.style.display = 'block';
    
    // Create editor components
    const editorToolbar = document.createElement('div');
    editorToolbar.id = 'quill-toolbar';
    
    const editorContent = document.createElement('div');
    editorContent.id = 'quill-editor';
    editorContent.style.height = 'calc(100vh - 12rem)';
    editorContent.style.overflowY = 'auto';
    
    editorContainer.appendChild(editorToolbar);
    editorContainer.appendChild(editorContent);
    
    // MODIFIED: Add the WYSIWYG editor at the top of the right panel
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
  
    // Add debounced change handler
    let changeTimeout;
    quillEditor.on('text-change', function() {
      // Clear previous timeout
      clearTimeout(changeTimeout);
      
      // Set new timeout to avoid rapid updates during typing
      changeTimeout = setTimeout(function() {
        if (!isUpdatingFromCodeEditor) {
          safeUpdateCodeEditor();
        }
      }, 500);
    });
  
    // Add editor toggle buttons
    addEditorToggle();
    
    // Initialize tracking of liquid tags
    initLiquidTagHighlighting();
    
    // MODIFIED: Immediately sync code to WYSIWYG on initial load - with a delay to ensure code is ready
    setTimeout(() => {
      safeUpdateWysiwygEditor();
    }, 500);
    
    // Dispatch event so other components know Quill is ready
    document.dispatchEvent(new Event('quillReady'));
    
    console.log('WYSIWYG editor initialized successfully');
  } catch (error) {
    console.error('Error initializing Quill editor:', error);
  }
}

// Add toggle buttons to switch between WYSIWYG and code editor
function addEditorToggle() {
  const container = document.createElement('div');
  container.className = 'mb-2 flex space-x-2';
  
  // Create toggle buttons
  const codeBtn = document.createElement('button');
  codeBtn.id = 'code-editor-btn';
  codeBtn.className = 'px-3 py-1 border rounded hover:bg-gray-300'; // MODIFIED: Not selected by default
  codeBtn.textContent = 'Code Editor';
  
  const wysiwygBtn = document.createElement('button');
  wysiwygBtn.id = 'wysiwyg-editor-btn';
  wysiwygBtn.className = 'px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300'; // MODIFIED: Selected by default
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
  
  // MODIFIED: Insert container right after the h2 title
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

// Pre-process Liquid tags to prevent them from being treated as HTML
function preprocessLiquidTags(html) {
  return html
    // Wrap liquid variable tags in special spans
    .replace(/({{\s*[^}]*}})/g, '<span class="ql-liquid" data-liquid-type="variable">$1</span>')
    // Wrap liquid control tags in special spans  
    .replace(/({%\s*[^%}]*\s*%})/g, '<span class="ql-liquid" data-liquid-type="control">$1</span>');
}

// Safe update of WYSIWYG editor from code editor
function safeUpdateWysiwygEditor() {
  if (!quillEditor) return;
  
  try {
    isUpdatingFromCodeEditor = true;
    
    // Get content from Ace editor
    const html = ace.edit('editor').getValue();
    
    // Extract body content 
    const bodyContent = extractBodyContent(html);
    
    // Pre-process the liquid tags to protect them
    const preprocessedContent = preprocessLiquidTags(bodyContent);
    
    // Clear existing content and insert new content
    quillEditor.setText('');
    quillEditor.clipboard.dangerouslyPasteHTML(0, preprocessedContent);
    
    console.log('Updated WYSIWYG editor successfully');
  } catch (error) {
    console.error('Error updating WYSIWYG editor:', error);
  } finally {
    // Reset flag with slight delay to ensure proper rendering
    setTimeout(() => {
      isUpdatingFromCodeEditor = false;
    }, 100);
  }
}

// Replace Quill's span for liquid tags with the raw liquid tag
function processMergedContent(content) {
  // Replace all occurrences of the wrapped liquid tags with the original tag
  return content
    .replace(/<span[^>]*class="ql-liquid"[^>]*data-liquid-type="variable"[^>]*>(.*?)<\/span>/g, '$1')
    .replace(/<span[^>]*class="ql-liquid"[^>]*data-liquid-type="control"[^>]*>(.*?)<\/span>/g, '$1');
}

// Safe update of code editor from WYSIWYG editor
function safeUpdateCodeEditor() {
  if (!quillEditor) return;
  
  try {
    isUpdatingFromWysiwyg = true;
    
    // Get the full HTML template from Ace editor
    const html = ace.edit('editor').getValue();
    
    // Get content from Quill
    let content = quillEditor.root.innerHTML;
    
    // Process content to properly handle liquid tags
    content = processMergedContent(content);
    
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
    // Reset flag with slight delay to avoid recursion
    setTimeout(() => {
      isUpdatingFromWysiwyg = false;
    }, 100);
  }
}

// Setup special handling for liquid tags
function initLiquidTagHighlighting() {
  // CSS for highlighting liquid tags
  const style = document.createElement('style');
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
  
  // We're avoiding MutationObserver due to compatibility issues
  // Instead, we'll highlight liquid tags after specific operations
  
  // Add a handler to Quill's text-change event to process liquid tags
  if (quillEditor) {
    quillEditor.on('text-change', function(delta, oldContents, source) {
      // Only process if the change came from user, not programmatic
      if (source === 'user' && !isUpdatingFromCodeEditor) {
        // Use a timeout to avoid recursion
        setTimeout(() => {
          safeSynchronizeContent();
        }, 100);
      }
    });
  } else {
    // If editor not ready, wait and try again
    setTimeout(() => {
      if (quillEditor) {
        quillEditor.on('text-change', function(delta, oldContents, source) {
          // Only process if the change came from user, not programmatic
          if (source === 'user' && !isUpdatingFromCodeEditor) {
            // Use a timeout to avoid recursion
            setTimeout(() => {
              safeSynchronizeContent();
            }, 100);
          }
        });
      }
    }, 1000);
  }
}

// Safer synchronization of content that prevents recursive updates
function safeSynchronizeContent() {
  // Update code editor from Quill
  safeUpdateCodeEditor();
  
  // Then update preview
  if (typeof window.updatePreview === 'function') {
    window.updatePreview();
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
      quillEditor) {
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
  originalInitTemplateElements();
  
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
      
      if (wysiwygVisible && quillEditor) {
        // Get the element ID
        const elementId = this.dataset.elementId;
        const template = templateElements.find(t => t.id === elementId);
        
        if (template) {
          try {
            // Process any liquid tags in the template
            const processedCode = preprocessLiquidTags(template.code);
            
            // Insert at cursor position in Quill safely
            const range = quillEditor.getSelection(true) || { index: 0, length: 0 };
            quillEditor.clipboard.dangerouslyPasteHTML(range.index, processedCode);
            
            // Close modal
            document.getElementById('template-elements-modal').classList.add('hidden');
            
            // Update preview
            safeUpdateCodeEditor();
            originalUpdatePreview();
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
  originalInitLiquidVariables();
  
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
      
      if (wysiwygVisible && quillEditor) {
        // Get the liquid variable code
        const codeElement = this.querySelector('code');
        if (!codeElement) return;
        
        const liquidCode = codeElement.textContent;
        
        try {
          // Create a span element for the liquid tag
          const range = quillEditor.getSelection(true) || { index: 0, length: 0 };
          
          // Insert the liquid tag as a specially formatted span
          const html = `<span class="ql-liquid" data-liquid-type="variable">${liquidCode}</span>`;
          quillEditor.clipboard.dangerouslyPasteHTML(range.index, html);
          
          // Close modal
          document.getElementById('liquid-vars-modal').classList.add('hidden');
          
          // Sync to code editor with delay
          setTimeout(() => {
            safeUpdateCodeEditor();
          }, 50);
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
  originalInitLiquidBlocks();
  
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
      
      if (wysiwygVisible && quillEditor) {
        // Get the liquid block code
        const preElement = this.querySelector('pre');
        if (!preElement) return;
        
        const liquidCode = preElement.textContent;
        
        try {
          // Get cursor position
          const range = quillEditor.getSelection(true) || { index: 0, length: 0 };
          
          // Process the liquid block code to wrap control tags
          const processedCode = preprocessLiquidTags(liquidCode);
          
          // Insert the processed code
          quillEditor.clipboard.dangerouslyPasteHTML(range.index, processedCode);
          
          // Close modal
          document.getElementById('liquid-blocks-modal').classList.add('hidden');
          
          // Sync to code editor with delay
          setTimeout(() => {
            safeUpdateCodeEditor();
          }, 50);
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

// Add a simple button component to the toolbar
function addSimpleComponentsButton() {
  const qlToolbar = document.querySelector('.ql-toolbar');
  
  if (qlToolbar && !document.getElementById('simple-components-btn')) {
    // Add separator
    const separator = document.createElement('span');
    separator.className = 'ql-formats';
    qlToolbar.appendChild(separator);
    
    // Create components button
    const componentsBtn = document.createElement('button');
    componentsBtn.id = 'simple-components-btn';
    componentsBtn.className = 'ql-components';
    componentsBtn.innerHTML = 'Add Component';
    componentsBtn.style.padding = '0 5px';
    componentsBtn.style.background = '#f0f4f8';
    componentsBtn.style.border = '1px solid #ccc';
    componentsBtn.style.borderRadius = '3px';
    
    // Add dropdown for component types
    const dropdown = document.createElement('select');
    dropdown.style.display = 'none';
    dropdown.style.position = 'absolute';
    dropdown.style.backgroundColor = 'white';
    dropdown.style.border = '1px solid #ccc';
    dropdown.style.borderRadius = '3px';
    dropdown.style.padding = '5px';
    dropdown.style.zIndex = '1000';
    
    // Add component options
    const components = [
      { value: 'button', text: 'Button' },
      { value: 'divider', text: 'Divider' },
      { value: 'spacer', text: 'Spacer' },
      { value: 'two-col', text: 'Two Columns' }
    ];
    
    components.forEach(comp => {
      const option = document.createElement('option');
      option.value = comp.value;
      option.textContent = comp.text;
      dropdown.appendChild(option);
    });
    
    // Add click event to show dropdown
    componentsBtn.addEventListener('click', function(e) {
      const rect = componentsBtn.getBoundingClientRect();
      dropdown.style.display = 'block';
      dropdown.style.left = rect.left + 'px';
      dropdown.style.top = (rect.bottom + 5) + 'px';
      e.stopPropagation();
    });
    
    // Add change event to insert component
    dropdown.addEventListener('change', function() {
      insertSimpleComponent(this.value);
      this.style.display = 'none';
    });
    
    // Hide dropdown when clicking elsewhere
    document.addEventListener('click', function() {
      dropdown.style.display = 'none';
    });
    
    // Add elements to toolbar
    qlToolbar.appendChild(componentsBtn);
    document.body.appendChild(dropdown);
  }
}

// Insert a simple component
function insertSimpleComponent(type) {
  if (!quillEditor) return;
  
  let html = '';
  
  switch (type) {
    case 'button':
      html = `<a href="#" style="display: inline-block; background-color: #3490dc; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; text-align: center;">Click Here</a>`;
      break;
    case 'divider':
      html = `<hr style="border: 0; height: 1px; background-color: #e2e8f0; margin: 24px 0;">`;
      break;
    case 'spacer':
      html = `<div style="height: 32px;"></div>`;
      break;
    case 'two-col':
      html = `<table style="width: 100%; border-collapse: collapse;">
  <tr>
    <td style="width: 50%; padding: 8px; vertical-align: top;">
      Left column content goes here.
    </td>
    <td style="width: 50%; padding: 8px; vertical-align: top;">
      Right column content goes here.
    </td>
  </tr>
</table>`;
      break;
  }
  
  if (html) {
    try {
      // Insert at cursor position
      const range = quillEditor.getSelection(true) || { index: 0, length: 0 };
      quillEditor.clipboard.dangerouslyPasteHTML(range.index, html);
      
      // Update code editor
      safeUpdateCodeEditor();
    } catch (error) {
      console.error('Error inserting component:', error);
    }
  }
}

// Initialize additional components after Quill is ready
document.addEventListener('DOMContentLoaded', function() {
  // Wait for Quill to be initialized
  const checkQuill = setInterval(function() {
    if (quillEditor) {
      clearInterval(checkQuill);
      
      // Add components button
      setTimeout(addSimpleComponentsButton, 500);
    }
  }, 500);
  
  // Set timeout to avoid infinite checking
  setTimeout(function() {
    clearInterval(checkQuill);
  }, 10000);
});
window.initLiquidVariables = originalInitLiquidVariables;