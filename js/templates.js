/**
 * Template elements data and functionality
 */

// Template elements data
const templateElements = [
    {
        id: 'header',
        title: 'Header',
        description: 'Email header with logo and welcome message',
        code: `<div class="header">
    <img src="{{ shop.email_logo_url }}" alt="{{ shop.name }}" class="logo">
    <h1>Your Order is Confirmed!</h1>
    <p>Hey {{ customer.first_name }}, thank you for your purchase.</p>
</div>`
    },
    {
        id: 'order-details',
        title: 'Order Details',
        description: 'Complete order summary with product list and totals',
        code: `<div class="order-details">
    <h2>Order Summary</h2>
    <table>
        <thead>
            <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
            </tr>
        </thead>
        <tbody>
            {% for line_item in order.line_items %}
            <tr>
                <td>
                    {{ line_item.title }}
                    {% if line_item.variant.title != 'Default Title' %}
                        <br><small>{{ line_item.variant.title }}</small>
                    {% endif %}
                </td>
                <td>{{ line_item.quantity }}</td>
                <td>{{ line_item.price | money }}</td>
            </tr>
            {% endfor %}
        </tbody>
        <tfoot>
            <tr>
                <td colspan="2"><strong>Subtotal</strong></td>
                <td>{{ order.subtotal_price | money }}</td>
            </tr>
            <tr>
                <td colspan="2"><strong>Shipping</strong></td>
                <td>{{ order.shipping_price | money }}</td>
            </tr>
            {% if order.tax_price > 0 %}
            <tr>
                <td colspan="2"><strong>Tax</strong></td>
                <td>{{ order.tax_price | money }}</td>
            </tr>
            {% endif %}
            <tr>
                <td colspan="2"><strong>Total</strong></td>
                <td>{{ order.total_price | money }}</td>
            </tr>
        </tfoot>
    </table>
</div>`
    },
    {
        id: 'product-row',
        title: 'Product Row',
        description: 'Single product line with title, variant, quantity and price',
        code: `<tr>
    <td>
        {{ line_item.title }}
        {% if line_item.variant.title != 'Default Title' %}
            <br><small>{{ line_item.variant.title }}</small>
        {% endif %}
    </td>
    <td>{{ line_item.quantity }}</td>
    <td>{{ line_item.price | money }}</td>
</tr>`
    },
    {
        id: 'customer-info',
        title: 'Customer Information',
        description: 'Customer contact details section',
        code: `<div class="customer-info">
    <h2>Customer Information</h2>
    <p>
        <strong>Name:</strong> {{ order.customer.name }}<br>
        <strong>Email:</strong> {{ order.customer.email }}<br>
        <strong>Phone:</strong> {{ order.customer.phone }}
    </p>
</div>`
    },
    {
        id: 'shipping-info',
        title: 'Shipping Information',
        description: 'Shipping address and method details',
        code: `<div class="shipping-info">
    <h2>Shipping Information</h2>
    <p>
        {{ order.shipping_address.name }}<br>
        {{ order.shipping_address.address1 }}<br>
        {% if order.shipping_address.address2 != "" %}
            {{ order.shipping_address.address2 }}<br>
        {% endif %}
        {{ order.shipping_address.city }}, {{ order.shipping_address.province_code }} {{ order.shipping_address.zip }}<br>
        {{ order.shipping_address.country }}
    </p>
    <p><strong>Shipping Method:</strong> {{ order.shipping_lines[0].title }}</p>
</div>`
    },
    {
        id: 'footer',
        title: 'Footer',
        description: 'Email footer with contact information and copyright',
        code: `<div class="footer">
    <p>If you have any questions, reply to this email or contact us at {{ shop.email }}</p>
    <p>&copy; {{ 'now' | date: "%Y" }} {{ shop.name }}. All rights reserved.</p>
</div>`
    }
];

// Initialize template elements in modal
function initTemplateElements() {
    const container = document.getElementById('template-elements-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    templateElements.forEach(element => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'border rounded p-3 hover:bg-gray-50 cursor-pointer template-element-item';
        itemDiv.dataset.elementId = element.id;
        
        itemDiv.innerHTML = `
            <h4 class="font-bold">${element.title}</h4>
            <p class="text-sm text-gray-600">${element.description}</p>
        `;
        
        itemDiv.addEventListener('click', function() {
            const elementId = this.dataset.elementId;
            const template = templateElements.find(t => t.id === elementId);
            
            if (template) {
                editor.insert(template.code);
                document.getElementById('template-elements-modal').classList.add('hidden');
            }
        });
        
        container.appendChild(itemDiv);
    });
}