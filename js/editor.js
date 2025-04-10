/**
 * Code Editor initialization and functionality
 */

// Initialize Ace Editor - this is now done in main.js to ensure proper order
// Window-level editor variable to ensure global access
// window.editor = ace.edit("editor");
// window.editor.setTheme("ace/theme/monokai");
// window.editor.session.setMode("ace/mode/html");

// Default template HTML - make it globally accessible
window.defaultTemplate = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ shop.name }} - Order Confirmation</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
            line-height: 1.5;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            max-width: 150px;
            margin-bottom: 20px;
        }
        h1 {
            font-size: 24px;
            margin-bottom: 10px;
        }
        .order-info {
            background-color: #f8f9fa;
            border-radius: 5px;
            padding: 15px;
            margin-bottom: 20px;
        }
        .order-details {
            margin-bottom: 30px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }
        th {
            background-color: #f1f5f9;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            font-size: 14px;
            color: #64748b;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="{{ shop.email_logo_url }}" alt="{{ shop.name }}" class="logo">
            <h1>Your Order is Confirmed!</h1>
            <p>Hey {{ customer.first_name }}, thank you for your purchase.</p>
        </div>
        
        <div class="order-info">
            <p><strong>Order Number:</strong> {{ order.name }}</p>
            <p><strong>Order Date:</strong> {{ order.created_at | date: "%B %d, %Y" }}</p>
            <p><strong>Payment Method:</strong> {{ order.transactions[0].gateway }}</p>
        </div>
        
        <div class="order-details">
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
        </div>
        
        <div class="shipping-info">
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
        </div>
        
        <div class="footer">
            <p>If you have any questions, reply to this email or contact us at {{ shop.email }}</p>
            <p>&copy; {{ 'now' | date: "%Y" }} {{ shop.name }}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;