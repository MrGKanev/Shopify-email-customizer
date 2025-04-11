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
});

/**
 * Create an enhanced toolbar above the code editor
 */
function createEnhancedToolbar() {
  // Create toolbar container
  const toolbar = document.createElement('div');
  toolbar.id = 'code-toolbar';
  toolbar.className = 'mb-2 p-2 bg-gray-100 border rounded flex flex-wrap space-x-1 space-y-1 items-center';
  
  // Text formatting section
  const textFormatSection = document.createElement('div');
  textFormatSection.className = 'flex space-x-1 mr-2';
  
  // Common text formatting buttons
  const formatButtons = [
    { id: 'format-h1', label: 'H1', tooltip: 'Heading 1 (Ctrl+1)', action: () => EditorInsertion.wrapSelection('<h1>', '</h1>') },
    { id: 'format-h2', label: 'H2', tooltip: 'Heading 2 (Ctrl+2)', action: () => EditorInsertion.wrapSelection('<h2>', '</h2>') },
    { id: 'format-p', label: 'P', tooltip: 'Paragraph (Ctrl+P)', action: () => EditorInsertion.wrapSelection('<p>', '</p>') },
    { id: 'format-bold', label: 'B', tooltip: 'Bold (Ctrl+B)', action: () => EditorInsertion.wrapSelection('<strong>', '</strong>') },
    { id: 'format-italic', label: 'I', tooltip: 'Italic (Ctrl+I)', action: () => EditorInsertion.wrapSelection('<em>', '</em>') },
    { id: 'format-a', label: 'Link', tooltip: 'Insert Link (Ctrl+K)', action: () => EditorInsertion.insertLink() }
  ];
  
  // Add format buttons
  formatButtons.forEach(btn => {
    const button = document.createElement('button');
    button.id = btn.id;
    button.className = 'px-2 py-1 border rounded hover:bg-gray-200';
    button.textContent = btn.label;
    button.title = btn.tooltip;
    button.addEventListener('click', btn.action);
    textFormatSection.appendChild(button);
  });
  
  toolbar.appendChild(textFormatSection);
  
  // Add separator
  const separator1 = document.createElement('div');
  separator1.className = 'h-6 border-l border-gray-300 mx-1';
  toolbar.appendChild(separator1);
  
  // Text alignment section
  const alignmentSection = document.createElement('div');
  alignmentSection.className = 'flex space-x-1 mr-2';
  
  // Text alignment buttons
  const alignmentButtons = [
    { id: 'align-left', icon: '⇐', tooltip: 'Align Left', action: () => EditorInsertion.wrapWithStyle('text-align: left;') },
    { id: 'align-center', icon: '↔', tooltip: 'Align Center', action: () => EditorInsertion.wrapWithStyle('text-align: center;') },
    { id: 'align-right', icon: '⇒', tooltip: 'Align Right', action: () => EditorInsertion.wrapWithStyle('text-align: right;') }
  ];
  
  alignmentButtons.forEach(btn => {
    const button = document.createElement('button');
    button.id = btn.id;
    button.className = 'px-2 py-1 border rounded hover:bg-gray-200';
    button.innerHTML = btn.icon;
    button.title = btn.tooltip;
    button.addEventListener('click', btn.action);
    alignmentSection.appendChild(button);
  });
  
  toolbar.appendChild(alignmentSection);
  
  // Add separator
  const separator2 = document.createElement('div');
  separator2.className = 'h-6 border-l border-gray-300 mx-1';
  toolbar.appendChild(separator2);
  
  // Font size section
  const fontSizeSection = document.createElement('div');
  fontSizeSection.className = 'flex items-center space-x-1 mr-2';
  
  const fontSizeLabel = document.createElement('span');
  fontSizeLabel.className = 'text-xs';
  fontSizeLabel.textContent = 'Size:';
  fontSizeSection.appendChild(fontSizeLabel);
  
  const fontSizeSelect = document.createElement('select');
  fontSizeSelect.className = 'py-1 px-1 border rounded text-sm';
  fontSizeSelect.title = 'Font Size';
  
  const fontSizes = [
    { value: '12px', label: '12px' },
    { value: '14px', label: '14px' },
    { value: '16px', label: '16px' },
    { value: '18px', label: '18px' },
    { value: '20px', label: '20px' },
    { value: '24px', label: '24px' },
    { value: '28px', label: '28px' },
    { value: '32px', label: '32px' },
  ];
  
  fontSizes.forEach(size => {
    const option = document.createElement('option');
    option.value = size.value;
    option.textContent = size.label;
    fontSizeSelect.appendChild(option);
  });
  
  fontSizeSelect.addEventListener('change', function() {
    EditorInsertion.wrapWithStyle(`font-size: ${this.value};`);
  });
  
  fontSizeSection.appendChild(fontSizeSelect);
  toolbar.appendChild(fontSizeSection);
  
  // Add separator
  const separator3 = document.createElement('div');
  separator3.className = 'h-6 border-l border-gray-300 mx-1';
  toolbar.appendChild(separator3);
  
  // Color picker section
  const colorSection = document.createElement('div');
  colorSection.className = 'flex items-center space-x-2 mr-2';
  
  // Text color
  const textColorLabel = document.createElement('span');
  textColorLabel.className = 'text-xs';
  textColorLabel.textContent = 'Text:';
  colorSection.appendChild(textColorLabel);
  
  const textColorPicker = document.createElement('input');
  textColorPicker.type = 'color';
  textColorPicker.className = 'w-6 h-6 border rounded cursor-pointer';
  textColorPicker.value = '#000000';
  textColorPicker.title = 'Text Color';
  textColorPicker.addEventListener('change', function() {
    EditorInsertion.wrapWithStyle(`color: ${this.value};`);
  });
  colorSection.appendChild(textColorPicker);
  
  // Background color
  const bgColorLabel = document.createElement('span');
  bgColorLabel.className = 'text-xs';
  bgColorLabel.textContent = 'BG:';
  colorSection.appendChild(bgColorLabel);
  
  const bgColorPicker = document.createElement('input');
  bgColorPicker.type = 'color';
  bgColorPicker.className = 'w-6 h-6 border rounded cursor-pointer';
  bgColorPicker.value = '#ffffff';
  bgColorPicker.title = 'Background Color';
  bgColorPicker.addEventListener('change', function() {
    EditorInsertion.wrapWithStyle(`background-color: ${this.value};`);
  });
  colorSection.appendChild(bgColorPicker);
  
  toolbar.appendChild(colorSection);
  
  // Add separator
  const separator4 = document.createElement('div');
  separator4.className = 'h-6 border-l border-gray-300 mx-1';
  toolbar.appendChild(separator4);
  
  // Add email component buttons
  const componentButtons = [
    { id: 'insert-button', label: 'Button', tooltip: 'Insert CTA Button', action: () => EditorInsertion.insertButton() },
    { id: 'insert-table', label: 'Table', tooltip: 'Insert Table', action: () => EditorInsertion.insertTable() },
    { id: 'insert-divider', label: 'Divider', tooltip: 'Insert Divider', action: () => EditorInsertion.insertDivider() },
    { id: 'insert-image', label: 'Image', tooltip: 'Insert Image', action: () => EditorInsertion.insertImage() },
    { id: 'insert-spacer', label: 'Spacer', tooltip: 'Insert Vertical Space', action: () => EditorInsertion.insertSpacer() }
  ];
  
  const componentSection = document.createElement('div');
  componentSection.className = 'flex space-x-1 mr-2';
  
  componentButtons.forEach(btn => {
    const button = document.createElement('button');
    button.id = btn.id;
    button.className = 'px-2 py-1 border rounded hover:bg-gray-200';
    button.textContent = btn.label;
    button.title = btn.tooltip;
    button.addEventListener('click', btn.action);
    componentSection.appendChild(button);
  });
  
  toolbar.appendChild(componentSection);
  
  // Add separator
  const separator5 = document.createElement('div');
  separator5.className = 'h-6 border-l border-gray-300 mx-1';
  toolbar.appendChild(separator5);
  
  // Undo/Redo section
  const undoRedoSection = document.createElement('div');
  undoRedoSection.className = 'flex space-x-1 mr-2';
  
  const undoButton = document.createElement('button');
  undoButton.id = 'undo-button';
  undoButton.className = 'px-2 py-1 border rounded hover:bg-gray-200';
  undoButton.innerHTML = '↩';
  undoButton.title = 'Undo (Ctrl+Z)';
  undoButton.addEventListener('click', function() {
    const aceEditor = ace.edit("editor");
    aceEditor.undo();
    aceEditor.focus();
  });
  undoRedoSection.appendChild(undoButton);
  
  const redoButton = document.createElement('button');
  redoButton.id = 'redo-button';
  redoButton.className = 'px-2 py-1 border rounded hover:bg-gray-200';
  redoButton.innerHTML = '↪';
  redoButton.title = 'Redo (Ctrl+Shift+Z)';
  redoButton.addEventListener('click', function() {
    const aceEditor = ace.edit("editor");
    aceEditor.redo();
    aceEditor.focus();
  });
  undoRedoSection.appendChild(redoButton);
  
  toolbar.appendChild(undoRedoSection);
  
  // Add format cleaning button
  const cleanButton = document.createElement('button');
  cleanButton.id = 'clean-html';
  cleanButton.className = 'px-2 py-1 border rounded hover:bg-gray-200';
  cleanButton.textContent = 'Clean HTML';
  cleanButton.title = 'Clean up HTML formatting';
  cleanButton.addEventListener('click', () => EditorInsertion.cleanHtmlFormatting());
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
    ModalManager.open('editor-help-modal');
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
      EditorInsertion.wrapSelection('<strong>', '</strong>');
    }
  });
  
  aceEditor.commands.addCommand({
    name: 'Italic',
    bindKey: {win: 'Ctrl-I', mac: 'Command-I'},
    exec: function(editor) {
      EditorInsertion.wrapSelection('<em>', '</em>');
    }
  });
  
  aceEditor.commands.addCommand({
    name: 'Link',
    bindKey: {win: 'Ctrl-K', mac: 'Command-K'},
    exec: function(editor) {
      EditorInsertion.insertLink();
    }
  });
  
  aceEditor.commands.addCommand({
    name: 'Heading1',
    bindKey: {win: 'Ctrl-1', mac: 'Command-1'},
    exec: function(editor) {
      EditorInsertion.wrapSelection('<h1>', '</h1>');
    }
  });
  
  aceEditor.commands.addCommand({
    name: 'Heading2',
    bindKey: {win: 'Ctrl-2', mac: 'Command-2'},
    exec: function(editor) {
      EditorInsertion.wrapSelection('<h2>', '</h2>');
    }
  });
  
  aceEditor.commands.addCommand({
    name: 'Paragraph',
    bindKey: {win: 'Ctrl-P', mac: 'Command-P'},
    exec: function(editor) {
      EditorInsertion.wrapSelection('<p>', '</p>');
    }
  });
}