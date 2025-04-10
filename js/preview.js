/**
 * Preview functionality
 */

// Update preview function
function updatePreview() {
    const previewFrame = document.getElementById('preview-frame');
    const previewDocument = previewFrame.contentDocument || previewFrame.contentWindow.document;
    previewDocument.open();
    
    // Replace Liquid tags with sample data for preview
    let html = editor.getValue()
        .replace(/{{ shop.name }}/g, 'Your Shopify Store')
        // Use a data URI for image placeholders instead of relative paths
        .replace(/{{ shop.email_logo_url }}/g, 'data:image/png;base64,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')
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
    html = html.replace(/{% for line_item in order.line_items %}([\s\S]*?){% endfor %}/g, (match, content) => {
        // Just repeat the content 3 times for preview
        return content + content + content;
    });
        
    // Handle Liquid if statements
    html = html.replace(/{% if (.*?) %}([\s\S]*?){% endif %}/g, (match, condition, content) => {
        // For preview, just include the content
        return content;
    });
        
    previewDocument.write(html);
    previewDocument.close();
}

// Initialize responsive view buttons
const initViewButtons = () => {
    const mobileViewBtn = document.getElementById('mobile-view');
    const desktopViewBtn = document.getElementById('desktop-view');
    const previewFrame = document.getElementById('preview-frame');

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