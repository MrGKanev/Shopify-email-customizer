/**
 * Improved Preview functionality
 */

// Update preview function
function updatePreview() {
    const previewFrame = document.getElementById('preview-frame');
    if (!previewFrame) {
        console.error('Preview frame not found');
        return;
    }
    
    const previewDocument = previewFrame.contentDocument || previewFrame.contentWindow.document;
    if (!previewDocument) {
        console.error('Preview document not accessible');
        return;
    }
    
    // Get the Ace editor instance
    const aceEditor = ace.edit("editor");
    if (!aceEditor) {
        console.error('Ace editor not initialized');
        return;
    }
    
    // Get HTML content from editor
    const html = aceEditor.getValue();
    if (!html) {
        console.warn('Editor content is empty');
    }
    
    // Open the preview document
    previewDocument.open();
    
    // Replace Liquid tags with sample data for preview
    let previewHtml = html
        .replace(/{{ shop.name }}/g, 'Your Shopify Store')
        // Use local image path for logo
        .replace(/{{ shop.email_logo_url }}/g, '../img/logo.svg')
        .replace(/{{ customer.first_name }}/g, 'John')
        .replace(/{{ order.name }}/g, '#1001')
        .replace(/{{ order.created_at \| date: "%B %d, %Y" }}/g, 'March 27, 2025')
        .replace(/{{ order.transactions\[0\].gateway }}/g, 'Credit Card')
        .replace(/{{ line_item.title }}/g, 'Sample Product')
        .replace(/{{ line_item.variant.title }}/g, 'Blue / Medium')
        .replace(/{{ line_item.quantity }}/g, '1')
        .replace(/{{ line_item.price \| money }}/g, '$29.99')
        .replace(/{{ order.subtotal_price \| money }}/g, '$29.99')
        .replace(/{{ order.shipping_price \| money }}/g, '$5.00')
        .replace(/{{ order.tax_price \| money }}/g, '$3.50')
        .replace(/{{ order.total_price \| money }}/g, '$38.49')
        .replace(/{{ order.shipping_address.name }}/g, 'John Doe')
        .replace(/{{ order.shipping_address.address1 }}/g, '123 Main Street')
        .replace(/{{ order.shipping_address.address2 }}/g, 'Apt 4B')
        .replace(/{{ order.shipping_address.city }}/g, 'New York')
        .replace(/{{ order.shipping_address.province_code }}/g, 'NY')
        .replace(/{{ order.shipping_address.zip }}/g, '10001')
        .replace(/{{ order.shipping_address.country }}/g, 'United States')
        .replace(/{{ order.shipping_lines\[0\].title }}/g, 'Standard Shipping')
        .replace(/{{ shop.email }}/g, 'support@yourstore.com')
        .replace(/{{ 'now' \| date: "%Y" }}/g, '2025');
        
    // Handle Liquid for loops
    previewHtml = previewHtml.replace(/{% for line_item in order.line_items %}([\s\S]*?){% endfor %}/g, (match, content) => {
        // Just repeat the content 3 times for preview
        return content + content + content;
    });
        
    // Handle Liquid if statements
    previewHtml = previewHtml.replace(/{% if (.*?) %}([\s\S]*?){% endif %}/g, (match, condition, content) => {
        // For preview, just include the content
        return content;
    });
    
    // Write the modified HTML to the preview
    previewDocument.write(previewHtml);
    previewDocument.close();
}

// Initialize responsive view buttons
const initViewButtons = () => {
    const mobileViewBtn = document.getElementById('mobile-view');
    const desktopViewBtn = document.getElementById('desktop-view');
    const previewFrame = document.getElementById('preview-frame');

    if (!mobileViewBtn || !desktopViewBtn || !previewFrame) {
        console.error('View buttons or preview frame not found');
        return;
    }

    mobileViewBtn.addEventListener('click', function() {
        this.classList.add('bg-gray-200');
        desktopViewBtn.classList.remove('bg-gray-200');
        previewFrame.style.width = '375px';
    });
    
    desktopViewBtn.addEventListener('click', function() {
        this.classList.add('bg-gray-200');
        mobileViewBtn.classList.remove('bg-gray-200');
        previewFrame.style.width = '100%';
    });
};