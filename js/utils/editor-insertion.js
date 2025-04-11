/**
 * Editor content insertion utility
 * Provides a unified way to insert content into the Ace editor
 */
const EditorInsertion = {
  // Reference to the Ace editor instance
  editor: null,
  
  // Initialize with editor reference
  init: function(editorInstance) {
    this.editor = editorInstance || ace.edit("editor");
    return this;
  },
  
  // Insert text at cursor position
  insertAtCursor: function(text) {
    if (!this.editor) {
      this.init();
    }
    
    this.editor.insert(text);
    this.editor.focus();
    
    // Update preview after insertion
    if (typeof updatePreview === 'function') {
      updatePreview();
    }
    
    return this;
  },
  
  // Wrap selected text with tags
  wrapSelection: function(startTag, endTag) {
    if (!this.editor) {
      this.init();
    }
    
    const selection = this.editor.getSelection();
    const range = selection.getRange();
    
    // Get selected text
    const selectedText = this.editor.session.getTextRange(range);
    
    // Create wrapped content
    const wrappedText = startTag + selectedText + endTag;
    
    // Replace selected text with wrapped content
    this.editor.session.replace(range, wrappedText);
    
    // If no text was selected, position cursor between tags
    if (selectedText.length === 0) {
      const cursor = range.start;
      selection.moveCursorTo(cursor.row, cursor.column + startTag.length);
    }
    
    // Focus editor
    this.editor.focus();
    
    // Update preview
    if (typeof updatePreview === 'function') {
      updatePreview();
    }
    
    return this;
  },
  
  // Wrap selected text with style attribute
  wrapWithStyle: function(styleValue) {
    if (!this.editor) {
      this.init();
    }
    
    const selection = this.editor.getSelection();
    const range = selection.getRange();
    
    // Get selected text
    const selectedText = this.editor.session.getTextRange(range);
    
    if (selectedText.length === 0) {
      // If no text is selected, create a span with the style
      const styledSpan = `<span style="${styleValue}">Text here</span>`;
      this.editor.session.replace(range, styledSpan);
      
      // Position cursor after "Text "
      const cursor = range.start;
      selection.moveCursorTo(cursor.row, cursor.column + styledSpan.indexOf('Text ') + 5);
    } else {
      // Check if selected text already has HTML tags
      const hasHtmlTags = /<[^>]+>/g.test(selectedText);
      
      if (hasHtmlTags) {
        // If it already has HTML tags, add style to the outermost tag
        const modifiedText = selectedText.replace(/<([^\s>]+)([^>]*)>/, function(match, tag, attributes) {
          // Check if the tag already has a style attribute
          if (attributes.includes('style="')) {
            // Append to existing style attribute
            return match.replace(/style="([^"]*)"/, function(styleMatch, existingStyle) {
              return `style="${existingStyle}; ${styleValue}"`;
            });
          } else {
            // Add new style attribute
            return `<${tag}${attributes} style="${styleValue}">`;
          }
        });
        
        this.editor.session.replace(range, modifiedText);
      } else {
        // Wrap with a styled span
        const styledText = `<span style="${styleValue}">${selectedText}</span>`;
        this.editor.session.replace(range, styledText);
      }
    }
    
    // Focus editor
    this.editor.focus();
    
    // Update preview
    if (typeof updatePreview === 'function') {
      updatePreview();
    }
    
    return this;
  },
  
  // Insert a link
  insertLink: function() {
    if (!this.editor) {
      this.init();
    }
    
    const selection = this.editor.getSelection();
    const range = selection.getRange();
    
    // Get selected text
    const selectedText = this.editor.session.getTextRange(range);
    
    // Prompt for URL
    const url = prompt('Enter URL:', 'https://');
    
    if (url) {
      // Create link HTML
      const linkText = selectedText || 'Link Text';
      const linkHtml = `<a href="${url}">${linkText}</a>`;
      
      // Insert or replace
      this.editor.session.replace(range, linkHtml);
      
      // Update preview
      if (typeof updatePreview === 'function') {
        updatePreview();
      }
    }
    
    return this;
  },
  
  // Insert a button
  insertButton: function() {
    if (!this.editor) {
      this.init();
    }
    
    const buttonText = prompt('Button text:', 'Click Here');
    const buttonUrl = prompt('Button URL:', 'https://');
    
    if (buttonText && buttonUrl) {
      const buttonHtml = `<a href="${buttonUrl}" style="display: inline-block; background-color: #3490dc; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; text-align: center;">${buttonText}</a>`;
      
      this.insertAtCursor(buttonHtml);
    }
    
    return this;
  },
  
  // Insert a table
  insertTable: function() {
    if (!this.editor) {
      this.init();
    }
    
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
    
    this.insertAtCursor(tableHtml);
    
    return this;
  },
  
  // Insert a horizontal divider
  insertDivider: function() {
    if (!this.editor) {
      this.init();
    }
    
    const dividerHtml = '<hr style="border: 0; height: 1px; background-color: #e2e8f0; margin: 24px 0;">';
    
    this.insertAtCursor(dividerHtml);
    
    return this;
  },
  
  // Insert an image
  insertImage: function() {
    if (!this.editor) {
      this.init();
    }
    
    const altText = prompt('Enter alt text:', 'Image description');
    
    const imageHtml = `<img src="img/logo.svg" alt="${altText || ''}" style="max-width: 100%; height: auto;">`;
    
    this.insertAtCursor(imageHtml);
    
    return this;
  },
  
  // Insert a vertical spacer
  insertSpacer: function() {
    if (!this.editor) {
      this.init();
    }
    
    const height = prompt('Spacer height in pixels:', '20');
    
    if (height) {
      const spacerHtml = `<div style="height: ${height}px;"></div>`;
      
      this.insertAtCursor(spacerHtml);
    }
    
    return this;
  },
  
  // Clean HTML formatting
  cleanHtmlFormatting: function() {
    if (!this.editor) {
      this.init();
    }
    
    const dirtyHtml = this.editor.getValue();
    
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
    this.editor.setValue(cleanHtml);
    this.editor.clearSelection();
    
    // Show confirmation message
    if (typeof Toast !== 'undefined') {
      Toast.show('HTML formatting cleaned!', 'success');
    }
    
    return this;
  }
};

// Initialize with editor when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  EditorInsertion.init(ace.edit("editor"));
});