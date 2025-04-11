/**
 * HTML minification functionality
 * 
 * This script adds minification capability to the email template editor.
 * It compresses HTML by removing comments, whitespace, and unnecessary characters
 * to make it easier to copy and paste into Shopify's email editor.
 */

// Minify HTML function
function minifyHTML(html) {
    if (!html) return '';
    
    return html
        // Remove comments (but keep conditional comments)
        .replace(/<!--(?![\[<][^\]>]*)[\s\S]*?-->/g, '')
        // Remove whitespace between HTML tags
        .replace(/>\s+</g, '><')
        // Remove leading and trailing whitespace
        .replace(/^\s+|\s+$/g, '')
        // Collapse multiple whitespace
        .replace(/\s{2,}/g, ' ');
}

/**
 * Copy minified HTML to clipboard
 * This function minifies the current HTML in the editor and copies it to the clipboard
 */
function copyMinifiedHTML() {
    const html = editor.getValue();
    const minified = minifyHTML(html);
    
    // Create a temporary textarea to copy from
    const textarea = document.createElement('textarea');
    textarea.value = minified;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        // Execute copy command
        const successful = document.execCommand('copy');
        
        // Show success or error message
        Toast.show(
            successful ? 'Minified HTML copied to clipboard!' : 'Failed to copy HTML. Please try again.',
            successful ? 'success' : 'error'
        );
    } catch (err) {
        console.error('Error copying text: ', err);
        Toast.show('Failed to copy HTML. Please try again.', 'error');
    }
    
    // Remove the temporary textarea
    document.body.removeChild(textarea);
}