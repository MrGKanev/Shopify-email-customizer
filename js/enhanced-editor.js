/**
 * Enhanced Code Editor
 * 
 * This file provides direct manipulation features for the code editor,
 * replacing the WYSIWYG editor while maintaining its functionality.
 */

// Check if the variable already exists in global scope
if (typeof window.isEnhancedEditorInitialized === 'undefined') {
  window.isEnhancedEditorInitialized = false;
}

document.addEventListener('DOMContentLoaded', function() {
  // Prevent multiple initializations
  if (window.isEnhancedEditorInitialized) return;
  window.isEnhancedEditorInitialized = true;
  
  // Initialize enhanced editor toolbar
  createEnhancedToolbar();
  
  // Initialize keyboard shortcuts
  initShortcuts();
  
  // Add event handlers for template insertions
  enhanceTemplateInsertions();
});

/**
 * Create an enhanced toolbar above the code editor
 */
function createEnhancedToolbar() {
  // Create toolbar container
  const toolbar = document.createElement('div');
  toolbar.id = 'code-toolbar';
  toolbar.className = 'mb-2 p-2 bg-gray-100 border rounded flex flex-wrap space-x-1 space-y-1 items-center';
  
  // Common text formatting buttons
  const formatButtons = [
    { id: 'format-h1', label: 'H1', tooltip: 'Heading 1 (Ctrl+1)', action: () => wrapSelection('<h1>', '</h1>') },
    { id: 'format-h2', label: 'H2', tooltip: 'Heading 2 (Ctrl+2)', action: () => wrapSelection('<h2>', '</h2>') },
    { id: 'format-p', label: 'P', tooltip: 'Paragraph (Ctrl+P)', action: () => wrapSelection('<p>', '</p>') },
    { id: 'format-bold', label: 'B', tooltip: 'Bold (Ctrl+B)', action: () => wrapSelection('<strong>', '</strong>') },
    { id: 'format-italic', label: 'I', tooltip: 'Italic (Ctrl+I)', action: () => wrapSelection('<em>', '</em>') },
    { id: 'format-a', label: 'Link', tooltip: 'Insert Link (Ctrl+K)', action: insertLink }
  ];
  
  // Add format buttons
  formatButtons.forEach(btn => {
    const button = document.createElement('button');
    button.id = btn.id;
    button.className = 'px-2 py-1 border rounded hover:bg-gray-200';
    button.textContent = btn.label;
    button.title = btn.tooltip;
    button.addEventListener('click', btn.action);
    toolbar.appendChild(button);
  });
  
  // Add separator
  const separator1 = document.createElement('div');
  separator1.className = 'h-6 border-l border-gray-300 mx-1';
  toolbar.appendChild(separator1);
  
  // Add email component buttons
  const componentButtons = [
    { id: 'insert-button', label: 'Button', tooltip: 'Insert CTA Button', action: insertButton },
    { id: 'insert-table', label: 'Table', tooltip: 'Insert Table', action: insertTable },
    { id: 'insert-divider', label: 'Divider', tooltip: 'Insert Divider', action: insertDivider }
  ];
  
  componentButtons.forEach(btn => {
    const button = document.createElement('button');
    button.id = btn.id;
    button.className = 'px-2 py-1 border rounded hover:bg-gray-200';
    button.textContent = btn.label;
    button.title = btn.tooltip;
    button.addEventListener('click', btn.action);
    toolbar.appendChild(button);
  });
  
  // Add separator
  const separator2 = document.createElement('div');
  separator2.className = 'h-6 border-l border-gray-300 mx-1';
  toolbar.appendChild(separator2);
  
  // Add format cleaning button
  const cleanButton = document.createElement('button');
  cleanButton.id = 'clean-html';
  cleanButton.className = 'px-2 py-1 border rounded hover:bg-gray-200';
  cleanButton.textContent = 'Clean HTML';
  cleanButton.title = 'Clean up HTML formatting';
  cleanButton.addEventListener('click', cleanHtmlFormatting);
  toolbar.appendChild(cleanButton);
  
  // Add help button
  const helpButton = document.createElement('button');
  helpButton.id = 'editor-help';
  helpButton.className = 'px-2 py-1 border rounded hover:bg-gray-200 ml-auto';
  helpButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
  </svg>`;
  helpButton.title = 'Editor Help';
  helpButton.addEventListener('click', function() {
    document.getElementById('editor-help-modal').classList.remove('hidden');
  });
  toolbar.appendChild(helpButton);
  
  // Insert toolbar before editor
  const editorElement = document.getElementById('editor');
  if (editorElement && editorElement.parentNode) {
    editorElement.parentNode.insertBefore(toolbar, editorElement);
  }
}

/**
 * Initialize keyboard shortcuts for the editor
 */
function initShortcuts() {
  const aceEditor = ace.edit("editor");
  
  // Add custom key bindings
  aceEditor.commands.addCommand({
    name: 'Bold',
    bindKey: {win: 'Ctrl-B', mac: 'Command-B'},
    exec: function(editor) {
      wrapSelection('<strong>', '</strong>');
    }
  });
  
  aceEditor.commands.addCommand({
    name: 'Italic',
    bindKey: {win: 'Ctrl-I', mac: 'Command-I'},
    exec: function(editor) {
      wrapSelection('<em>', '</em>');
    }
  });
  
  aceEditor.commands.addCommand({
    name: 'Link',
    bindKey: {win: 'Ctrl-K', mac: 'Command-K'},
    exec: function(editor) {
      insertLink();
    }
  });
  
  aceEditor.commands.addCommand({
    name: 'Heading1',
    bindKey: {win: 'Ctrl-1', mac: 'Command-1'},
    exec: function(editor) {
      wrapSelection('<h1>', '</h1>');
    }
  });
  
  aceEditor.commands.addCommand({
    name: 'Heading2',
    bindKey: {win: 'Ctrl-2', mac: 'Command-2'},
    exec: function(editor) {
      wrapSelection('<h2>', '</h2>');
    }
  });
  
  aceEditor.commands.addCommand({
    name: 'Paragraph',
    bindKey: {win: 'Ctrl-P', mac: 'Command-P'},
    exec: function(editor) {
      wrapSelection('<p>', '</p>');
    }
  });
}

/**
 * Enhance template insertion handlers for more direct editing
 */
function enhanceTemplateInsertions() {
  // Enhance liquid variable insertions
  enhanceLiquidVariables();
  
  // Enhance liquid blocks insertions
  enhanceLiquidBlocks();
  
  // Enhance template elements insertions
  enhanceTemplateElements();
}

/**
 * Enhance liquid variables with direct insertions
 */
function enhanceLiquidVariables() {
  const container = document.getElementById('liquid-vars-container');
  if (!container) return;
  
  const items = container.querySelectorAll('.liquid-var-item');
  items.forEach(item => {
    item.onclick = function() {
      const codeElement = this.querySelector('code');
      if (!codeElement) return;
      
      const liquidCode = codeElement.textContent;
      
      // Insert at cursor position in code editor
      insertAtCursor(liquidCode);
      
      // Close modal
      document.getElementById('liquid-vars-modal').classList.add('hidden');
      
      // Update preview
      updatePreview();
    };
  });
}

/**
 * Enhance liquid blocks with direct insertions
 */
function enhanceLiquidBlocks() {
  const container = document.getElementById('liquid-blocks-container');
  if (!container) return;
  
  const items = container.querySelectorAll('.liquid-block-item');
  items.forEach(item => {
    item.onclick = function() {
      const preElement = this.querySelector('pre');
      if (!preElement) return;
      
      const liquidCode = preElement.textContent;
      
      // Insert at cursor position in code editor
      insertAtCursor(liquidCode);
      
      // Close modal
      document.getElementById('liquid-blocks-modal').classList.add('hidden');
      
      // Update preview
      updatePreview();
    };
  });
}

/**
 * Enhance template elements with direct insertions
 */
function enhanceTemplateElements() {
  const container = document.getElementById('template-elements-container');
  if (!container) return;
  
  const items = container.querySelectorAll('.template-element-item');
  items.forEach(item => {
    item.onclick = function() {
      const elementId = this.dataset.elementId;
      const template = window.templateElements && 
        window.templateElements.find(t => t.id === elementId);
      
      if (template) {
        // Insert at cursor position in code editor
        insertAtCursor(template.code);
        
        // Close modal
        document.getElementById('template-elements-modal').classList.add('hidden');
        
        // Update preview
        updatePreview();
      }
    };
  });
}

/**
 * Helper function to wrap selected text in the editor with tags
 */
function wrapSelection(startTag, endTag) {
  const aceEditor = ace.edit("editor");
  const selection = aceEditor.getSelection();
  const range = selection.getRange();
  
  // Get selected text
  const selectedText = aceEditor.session.getTextRange(range);
  
  // Create wrapped content
  const wrappedText = startTag + selectedText + endTag;
  
  // Replace selected text with wrapped content
  aceEditor.session.replace(range, wrappedText);
  
  // If no text was selected, position cursor between tags
  if (selectedText.length === 0) {
    const cursor = range.start;
    selection.moveCursorTo(cursor.row, cursor.column + startTag.length);
  }
  
  // Focus editor
  aceEditor.focus();
  
  // Update preview
  updatePreview();
}

/**
 * Insert text at the current cursor position
 */
function insertAtCursor(text) {
  const aceEditor = ace.edit("editor");
  aceEditor.insert(text);
  aceEditor.focus();
}

/**
 * Insert a link at the current cursor position or wrap selected text
 */
function insertLink() {
  const aceEditor = ace.edit("editor");
  const selection = aceEditor.getSelection();
  const range = selection.getRange();
  
  // Get selected text
  const selectedText = aceEditor.session.getTextRange(range);
  
  // Prompt for URL
  const url = prompt('Enter URL:', 'https://');
  
  if (url) {
    // Create link HTML
    const linkText = selectedText || 'Link Text';
    const linkHtml = `<a href="${url}">${linkText}</a>`;
    
    // Insert or replace
    aceEditor.session.replace(range, linkHtml);
    
    // Update preview
    updatePreview();
  }
}

/**
 * Insert a button at the current cursor position
 */
function insertButton() {
  const buttonText = prompt('Button text:', 'Click Here');
  const buttonUrl = prompt('Button URL:', 'https://');
  
  if (buttonText && buttonUrl) {
    const buttonHtml = `<a href="${buttonUrl}" style="display: inline-block; background-color: #3490dc; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; text-align: center;">${buttonText}</a>`;
    
    insertAtCursor(buttonHtml);
    updatePreview();
  }
}

/**
 * Insert a table at the current cursor position
 */
function insertTable() {
  const rows = parseInt(prompt('Number of rows:', '3'), 10) || 3;
  const cols = parseInt(prompt('Number of columns:', '3'), 10) || 3;
  
  let tableHtml = '<table style="width: 100%; border-collapse: collapse;">\n';
  
  // Add header row
  tableHtml += '  <thead>\n    <tr>\n';
  for (let c = 0; c < cols; c++) {
    tableHtml += '      <th style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: left;">Header ' + (c+1) + '</th>\n';
  }
  tableHtml += '    </tr>\n  </thead>\n';
  
  // Add body rows
  tableHtml += '  <tbody>\n';
  for (let r = 0; r < rows - 1; r++) {
    tableHtml += '    <tr>\n';
    for (let c = 0; c < cols; c++) {
      tableHtml += '      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Cell ' + (r+1) + '-' + (c+1) + '</td>\n';
    }
    tableHtml += '    </tr>\n';
  }
  tableHtml += '  </tbody>\n</table>';
  
  insertAtCursor(tableHtml);
  updatePreview();
}

/**
 * Insert a horizontal divider at the current cursor position
 */
function insertDivider() {
  const dividerHtml = '<hr style="border: 0; height: 1px; background-color: #e2e8f0; margin: 24px 0;">';
  
  insertAtCursor(dividerHtml);
  updatePreview();
}

/**
 * Clean HTML formatting for better readability
 */
function cleanHtmlFormatting() {
  const aceEditor = ace.edit("editor");
  const dirtyHtml = aceEditor.getValue();
  
  // Basic HTML formatting (not a full formatter, just basic cleanup)
  let cleanHtml = dirtyHtml
    // Fix indentation for tags
    .replace(/<\/(div|p|table|tr|td|th|thead|tbody|tfoot|h[1-6]|ul|ol|li|section|article|header|footer)>/g, '</$1>\n')
    .replace(/<(div|table|thead|tbody|tfoot|ul|ol|section|article|header|footer)([^>]*)>/g, '\n<$1$2>\n')
    .replace(/<(tr)([^>]*)>/g, '  <$1$2>\n')
    .replace(/<(td|th)([^>]*)>/g, '    <$1$2>')
    .replace(/<(h[1-6]|p)([^>]*)>/g, '\n<$1$2>');
  
  // Remove multiple blank lines
  cleanHtml = cleanHtml.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  // Set the formatted HTML back to the editor
  aceEditor.setValue(cleanHtml);
  aceEditor.clearSelection();
  
  // Show confirmation message
  showToast('HTML formatting cleaned!');
}

/**
 * Show a toast message
 */
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

/**
 * Add close handlers to help modal
 */
document.addEventListener('DOMContentLoaded', function() {
  const helpModal = document.getElementById('editor-help-modal');
  if (helpModal) {
    // Close when clicking close button
    const closeBtn = helpModal.querySelector('.close-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        helpModal.classList.add('hidden');
      });
    }
    
    // Close when clicking outside
    helpModal.addEventListener('click', function(event) {
      if (event.target === helpModal) {
        helpModal.classList.add('hidden');
      }
    });
  }
});