/**
 * Liquid variables data and functionality
 */

// Liquid variables data
const liquidVariables = [
    {
        name: 'shop.name',
        description: 'The name of your Shopify store',
        code: '{{ shop.name }}'
    },
    {
        name: 'shop.email',
        description: 'The email address of your Shopify store',
        code: '{{ shop.email }}'
    },
    {
        name: 'shop.address',
        description: 'The address of your Shopify store',
        code: '{{ shop.address }}'
    },
    {
        name: 'shop.email_logo_url',
        description: 'URL to the logo you\'ve set for email notifications',
        code: '{{ shop.email_logo_url }}'
    },
    {
        name: 'customer.first_name',
        description: 'The customer\'s first name',
        code: '{{ customer.first_name }}'
    },
    {
        name: 'customer.last_name',
        description: 'The customer\'s last name',
        code: '{{ customer.last_name }}'
    },
    {
        name: 'customer.email',
        description: 'The customer\'s email address',
        code: '{{ customer.email }}'
    },
    {
        name: 'order.name',
        description: 'The order name, typically the order number',
        code: '{{ order.name }}'
    },
    {
        name: 'order.created_at',
        description: 'The date and time when the order was created',
        code: '{{ order.created_at | date: "%B %d, %Y" }}'
    },
    {
        name: 'order.subtotal_price',
        description: 'The order subtotal (excluding tax and shipping)',
        code: '{{ order.subtotal_price | money }}'
    },
    {
        name: 'order.total_price',
        description: 'The order total price',
        code: '{{ order.total_price | money }}'
    },
    {
        name: 'order.shipping_price',
        description: 'The shipping cost for the order',
        code: '{{ order.shipping_price | money }}'
    },
    {
        name: 'order.note',
        description: 'Any additional notes made by the customer',
        code: '{{ order.note }}'
    }
];

// Initialize liquid variables in modal
function initLiquidVariables() {
    const container = document.getElementById('liquid-vars-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    liquidVariables.forEach(variable => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'border rounded p-3 hover:bg-gray-50 cursor-pointer liquid-var-item';
        
        itemDiv.innerHTML = `
            <h4 class="font-bold">${variable.name}</h4>
            <p class="text-sm text-gray-600">${variable.description}</p>
            <code class="text-xs bg-gray-100 p-1 mt-1">${variable.code}</code>
        `;
        
        itemDiv.addEventListener('click', function() {
            editor.insert(variable.code);
            document.getElementById('liquid-vars-modal').classList.add('hidden');
        });
        
        container.appendChild(itemDiv);
    });
}