/**
 * Template elements data and functionality
 */

// Template elements data
const templateElements = [
    {
        id: 'header',
        title: 'Header',
        description: 'Email header with logo and welcome message',
        code: `<div class="header" style="text-align: center; margin-bottom: 30px;">
    <img src="img/logo.svg" alt="{{ shop.name }}" style="max-width: 150px; margin-bottom: 20px;">
    <h1 style="font-size: 24px; color: #2a4365; margin-bottom: 10px;">Your Order is Confirmed!</h1>
    <p style="font-size: 16px; color: #4a5568;">Hey {{ customer.first_name }}, thank you for your purchase.</p>
</div>`
    },
    {
        id: 'modern-header',
        title: 'Modern Header',
        description: 'Stylish header with accent color and modern layout',
        code: `<div style="background-color: #f8fafc; padding: 30px 20px; border-radius: 8px; margin-bottom: 30px;">
    <div style="display: flex; align-items: center; justify-content: space-between;">
        <div>
            <img src="img/logo.svg" alt="{{ shop.name }}" style="max-width: 120px;">
        </div>
        <div style="text-align: right;">
            <p style="margin: 0; font-size: 14px; color: #64748b;">Order #{{ order.name }}</p>
            <p style="margin: 0; font-size: 12px; color: #94a3b8;">{{ order.created_at | date: "%B %d, %Y" }}</p>
        </div>
    </div>
    <div style="margin-top: 25px; border-left: 4px solid #3b82f6; padding-left: 15px;">
        <h1 style="font-size: 22px; color: #1e3a8a; margin: 0 0 5px 0;">Thanks for your order, {{ customer.first_name }}!</h1>
        <p style="font-size: 16px; color: #475569; margin: 0;">We're processing your order now and will send you tracking info soon.</p>
    </div>
</div>`
    },
    {
        id: 'order-details',
        title: 'Order Details',
        description: 'Complete order summary with product list and totals',
        code: `<div class="order-details" style="margin-bottom: 30px;">
    <h2 style="font-size: 20px; color: #2d3748; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Order Summary</h2>
    <table style="width: 100%; border-collapse: collapse;">
        <thead>
            <tr>
                <th style="padding: 12px 15px; text-align: left; border-bottom: 1px solid #e2e8f0; background-color: #f1f5f9; color: #4a5568;">Product</th>
                <th style="padding: 12px 15px; text-align: center; border-bottom: 1px solid #e2e8f0; background-color: #f1f5f9; color: #4a5568;">Quantity</th>
                <th style="padding: 12px 15px; text-align: right; border-bottom: 1px solid #e2e8f0; background-color: #f1f5f9; color: #4a5568;">Price</th>
            </tr>
        </thead>
        <tbody>
            {% for line_item in order.line_items %}
            <tr>
                <td style="padding: 12px 15px; text-align: left; border-bottom: 1px solid #e2e8f0; color: #2d3748;">
                    {{ line_item.title }}
                    {% if line_item.variant.title != 'Default Title' %}
                        <br><small style="color: #718096;">{{ line_item.variant.title }}</small>
                    {% endif %}
                </td>
                <td style="padding: 12px 15px; text-align: center; border-bottom: 1px solid #e2e8f0; color: #2d3748;">{{ line_item.quantity }}</td>
                <td style="padding: 12px 15px; text-align: right; border-bottom: 1px solid #e2e8f0; color: #2d3748;">{{ line_item.price | money }}</td>
            </tr>
            {% endfor %}
        </tbody>
        <tfoot>
            <tr>
                <td colspan="2" style="padding: 12px 15px; text-align: right; border-bottom: 1px solid #e2e8f0;"><strong style="color: #4a5568;">Subtotal</strong></td>
                <td style="padding: 12px 15px; text-align: right; border-bottom: 1px solid #e2e8f0; color: #2d3748;">{{ order.subtotal_price | money }}</td>
            </tr>
            <tr>
                <td colspan="2" style="padding: 12px 15px; text-align: right; border-bottom: 1px solid #e2e8f0;"><strong style="color: #4a5568;">Shipping</strong></td>
                <td style="padding: 12px 15px; text-align: right; border-bottom: 1px solid #e2e8f0; color: #2d3748;">{{ order.shipping_price | money }}</td>
            </tr>
            {% if order.tax_price > 0 %}
            <tr>
                <td colspan="2" style="padding: 12px 15px; text-align: right; border-bottom: 1px solid #e2e8f0;"><strong style="color: #4a5568;">Tax</strong></td>
                <td style="padding: 12px 15px; text-align: right; border-bottom: 1px solid #e2e8f0; color: #2d3748;">{{ order.tax_price | money }}</td>
            </tr>
            {% endif %}
            <tr>
                <td colspan="2" style="padding: 12px 15px; text-align: right; border-bottom: none;"><strong style="color: #1a202c; font-size: 16px;">Total</strong></td>
                <td style="padding: 12px 15px; text-align: right; border-bottom: none; color: #1a202c; font-size: 16px; font-weight: bold;">{{ order.total_price | money }}</td>
            </tr>
        </tfoot>
    </table>
</div>`
    },
    {
        id: 'colored-product-row',
        title: 'Colored Product Row',
        description: 'Styled product row with alternating colors',
        code: `<tr style="{% cycle 'background-color: #f8fafc;', '' %}">
    <td style="padding: 12px 15px; text-align: left; border-bottom: 1px solid #e2e8f0; color: #2d3748;">
        <div style="display: flex; align-items: center;">
            <div style="margin-right: 12px;">
                <img src="img/logo.svg" alt="{{ line_item.title }}" style="width: 50px; height: 50px; border-radius: 4px; border: 1px solid #e2e8f0;">
            </div>
            <div>
                <span style="font-weight: 500;">{{ line_item.title }}</span>
                {% if line_item.variant.title != 'Default Title' %}
                    <br><small style="color: #718096;">{{ line_item.variant.title }}</small>
                {% endif %}
            </div>
        </div>
    </td>
    <td style="padding: 12px 15px; text-align: center; border-bottom: 1px solid #e2e8f0; color: #2d3748;">{{ line_item.quantity }}</td>
    <td style="padding: 12px 15px; text-align: right; border-bottom: 1px solid #e2e8f0; color: #2d3748;">{{ line_item.price | money }}</td>
</tr>`
    },
    {
        id: 'customer-info',
        title: 'Customer Information',
        description: 'Customer contact details section',
        code: `<div class="customer-info" style="background-color: #f1f5f9; border-radius: 6px; padding: 20px; margin-bottom: 25px;">
    <h2 style="font-size: 18px; color: #334155; margin-top: 0; margin-bottom: 15px; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px;">Customer Information</h2>
    <p style="margin: 0; line-height: 1.6;">
        <strong style="color: #475569;">Name:</strong> <span style="color: #1e293b;">{{ order.customer.name }}</span><br>
        <strong style="color: #475569;">Email:</strong> <span style="color: #1e293b;">{{ order.customer.email }}</span><br>
        <strong style="color: #475569;">Phone:</strong> <span style="color: #1e293b;">{{ order.customer.phone }}</span>
    </p>
</div>`
    },
    {
        id: 'shipping-info',
        title: 'Shipping Information',
        description: 'Shipping address and method details',
        code: `<div class="shipping-info" style="background-color: #f1f5f9; border-radius: 6px; padding: 20px; margin-bottom: 25px;">
    <h2 style="font-size: 18px; color: #334155; margin-top: 0; margin-bottom: 15px; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px;">Shipping Information</h2>
    <div style="display: flex; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 250px; padding-right: 15px;">
            <h3 style="font-size: 16px; color: #64748b; margin-top: 0; margin-bottom: 10px;">Shipping Address</h3>
            <p style="margin: 0; line-height: 1.6; color: #1e293b;">
                {{ order.shipping_address.name }}<br>
                {{ order.shipping_address.address1 }}<br>
                {% if order.shipping_address.address2 != "" %}
                    {{ order.shipping_address.address2 }}<br>
                {% endif %}
                {{ order.shipping_address.city }}, {{ order.shipping_address.province_code }} {{ order.shipping_address.zip }}<br>
                {{ order.shipping_address.country }}
            </p>
        </div>
        <div style="flex: 1; min-width: 250px;">
            <h3 style="font-size: 16px; color: #64748b; margin-top: 0; margin-bottom: 10px;">Shipping Method</h3>
            <p style="margin: 0; color: #1e293b;">
                <span style="display: inline-block; background-color: #3b82f6; color: white; padding: 4px 8px; border-radius: 4px; font-size: 14px;">{{ order.shipping_lines[0].title }}</span>
            </p>
        </div>
    </div>
</div>`
    },
    {
        id: 'modern-footer',
        title: 'Modern Footer',
        description: 'Professional email footer with social links',
        code: `<div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
    <div style="margin-bottom: 15px;">
        <a href="https://{{ shop.domain }}" style="display: inline-block; margin: 0 10px; color: #4a5568; text-decoration: none;">Visit Store</a>
        <a href="https://{{ shop.domain }}/account" style="display: inline-block; margin: 0 10px; color: #4a5568; text-decoration: none;">My Account</a>
        <a href="https://{{ shop.domain }}/pages/contact" style="display: inline-block; margin: 0 10px; color: #4a5568; text-decoration: none;">Contact Us</a>
    </div>
    <p style="color: #64748b; font-size: 14px; margin-bottom: 5px;">If you have any questions, reply to this email or contact us at {{ shop.email }}</p>
    <p style="color: #94a3b8; font-size: 12px;">&copy; {{ 'now' | date: "%Y" }} {{ shop.name }}. All rights reserved.</p>
</div>`
    },
    {
        id: 'special-banner',
        title: 'Special Offer Banner',
        description: 'Promotional banner with call-to-action button',
        code: `<div style="background-color: #4338ca; color: white; padding: 20px; text-align: center; margin: 30px 0; border-radius: 6px;">
    <h2 style="margin-top: 0; margin-bottom: 10px; font-size: 20px;">Thanks for your purchase!</h2>
    <p style="margin-bottom: 20px; font-size: 16px;">Enjoy 15% off your next order with code: <strong>THANKYOU15</strong></p>
    <a href="https://{{ shop.domain }}" style="display: inline-block; background-color: white; color: #4338ca; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; text-align: center;">Shop Now</a>
</div>`
    },
    {
        id: 'image-grid',
        title: 'Image Grid',
        description: 'Grid layout for product recommendations',
        code: `<div style="margin: 30px 0;">
    <h2 style="text-align: center; font-size: 20px; color: #2d3748; margin-bottom: 20px;">You might also like</h2>
    <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 15px;">
        <!-- Repeat this block for each product -->
        <div style="width: 150px; text-align: center;">
            <img src="img/logo.svg" alt="Product 1" style="width: 100%; height: auto; border-radius: 4px; margin-bottom: 10px; border: 1px solid #e2e8f0;">
            <h3 style="margin: 0 0 5px 0; font-size: 16px; color: #2d3748;">Product Name</h3>
            <p style="margin: 0; color: #4a5568; font-size: 14px;">$19.99</p>
        </div>
        <div style="width: 150px; text-align: center;">
            <img src="img/logo.svg" alt="Product 2" style="width: 100%; height: auto; border-radius: 4px; margin-bottom: 10px; border: 1px solid #e2e8f0;">
            <h3 style="margin: 0 0 5px 0; font-size: 16px; color: #2d3748;">Product Name</h3>
            <p style="margin: 0; color: #4a5568; font-size: 14px;">$24.99</p>
        </div>
        <div style="width: 150px; text-align: center;">
            <img src="img/logo.svg" alt="Product 3" style="width: 100%; height: auto; border-radius: 4px; margin-bottom: 10px; border: 1px solid #e2e8f0;">
            <h3 style="margin: 0 0 5px 0; font-size: 16px; color: #2d3748;">Product Name</h3>
            <p style="margin: 0; color: #4a5568; font-size: 14px;">$29.99</p>
        </div>
    </div>
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