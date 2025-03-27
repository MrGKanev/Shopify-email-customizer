/**
 * Liquid blocks data and functionality
 */

// Liquid blocks data
const liquidBlocks = [
    {
        id: 'order-discounts',
        title: 'Order Discounts',
        code: `{% if order.discounts %}
  <div class="discounts">
    <h3>Discounts</h3>
    <ul>
      {% for discount in order.discounts %}
        <li>{{ discount.title }} (-{{ discount.savings | money }})</li>
      {% endfor %}
    </ul>
  </div>
{% endif %}`
    },
    {
        id: 'customer-note',
        title: 'Customer Note',
        code: `{% if order.note %}
  <div class="customer-note">
    <h3>Order Notes</h3>
    <p>{{ order.note }}</p>
  </div>
{% endif %}`
    },
    {
        id: 'shipping-address',
        title: 'Shipping Address',
        code: `{% if order.shipping_address %}
  <div class="shipping-address">
    <h3>Shipping Address</h3>
    <p>
      {{ order.shipping_address.name }}<br>
      {{ order.shipping_address.address1 }}<br>
      {% if order.shipping_address.address2 != blank %}
        {{ order.shipping_address.address2 }}<br>
      {% endif %}
      {{ order.shipping_address.city }}, {{ order.shipping_address.province_code }} {{ order.shipping_address.zip }}<br>
      {{ order.shipping_address.country }}
    </p>
  </div>
{% endif %}`
    },
    {
        id: 'billing-address',
        title: 'Billing Address',
        code: `{% if order.billing_address %}
  <div class="billing-address">
    <h3>Billing Address</h3>
    <p>
      {{ order.billing_address.name }}<br>
      {{ order.billing_address.address1 }}<br>
      {% if order.billing_address.address2 != blank %}
        {{ order.billing_address.address2 }}<br>
      {% endif %}
      {{ order.billing_address.city }}, {{ order.billing_address.province_code }} {{ order.billing_address.zip }}<br>
      {{ order.billing_address.country }}
    </p>
  </div>
{% endif %}`
    },
    {
        id: 'payment-method',
        title: 'Payment Method',
        code: `{% if order.transactions.first.gateway %}
  <div class="payment-method">
    <h3>Payment Method</h3>
    <p>{{ order.transactions.first.gateway | capitalize }}</p>
  </div>
{% endif %}`
    },
    {
        id: 'shipping-method',
        title: 'Shipping Method',
        code: `{% if order.shipping_lines.first.title %}
  <div class="shipping-method">
    <h3>Shipping Method</h3>
    <p>{{ order.shipping_lines.first.title }}</p>
  </div>
{% endif %}`
    },
    {
        id: 'order-fulfillments',
        title: 'Order Fulfillments',
        code: `{% if order.fulfillments.size > 0 %}
  <div class="fulfillments">
    <h3>Fulfillment</h3>
    {% for fulfillment in order.fulfillments %}
      <div class="fulfillment">
        <p><strong>Fulfillment #{{ forloop.index }}</strong></p>
        {% if fulfillment.tracking_numbers.size > 0 %}
          <p>
            <strong>Tracking number:</strong>
            {% for tracking_number in fulfillment.tracking_numbers %}
              {% if fulfillment.tracking_url %}
                <a href="{{ fulfillment.tracking_url }}">{{ tracking_number }}</a>
              {% else %}
                {{ tracking_number }}
              {% endif %}
              {% unless forloop.last %}, {% endunless %}
            {% endfor %}
          </p>
        {% endif %}
      </div>
    {% endfor %}
  </div>
{% endif %}`
    },
    {
        id: 'gift-card',
        title: 'Gift Card',
        code: `{% if order.total_price == 0 and order.transactions.first.kind == "authorization" and order.transactions.first.status == "success" %}
  <div class="gift-card">
    <h3>Gift Card</h3>
    <p>This order was paid for using a gift card.</p>
  </div>
{% endif %}`
    }
];

// Initialize liquid blocks in modal
function initLiquidBlocks() {
    const container = document.getElementById('liquid-blocks-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    liquidBlocks.forEach(block => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'border rounded p-3 hover:bg-gray-50 cursor-pointer liquid-block-item';
        
        itemDiv.innerHTML = `
            <h4 class="font-bold">${block.title}</h4>
            <pre class="text-xs bg-gray-100 p-2 mt-2 overflow-x-auto">${block.code}</pre>
        `;
        
        itemDiv.addEventListener('click', function() {
            editor.insert(block.code);
            document.getElementById('liquid-blocks-modal').classList.add('hidden');
        });
        
        container.appendChild(itemDiv);
    });
}