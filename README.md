# Shopify Email Customizer

A browser-based visual editor for creating and customizing Shopify email templates with real-time preview.

## Features

- **Split-pane Interface**: Visual preview on the left, code editor on the right
- **Real-time Preview**: Instantly see changes as you edit
- **Responsive Testing**: Toggle between desktop and mobile views
- **Template Elements**: Insert common email components with a single click
- **Drag Resizing**: Adjust panel sizes to suit your workflow

## Usage

### Code Editor

The right panel contains a full-featured code editor with syntax highlighting for HTML and Liquid tags. All changes automatically update the preview.

### Preview Panel

The left panel shows a live preview of your email template. Use the mobile/desktop toggle buttons to test responsiveness.

### Template Elements

Use the dropdown to insert pre-built components:

- Header
- Order Details
- Product Row
- Customer Information
- Shipping Information
- Footer

### Liquid Tags

The editor supports Shopify's Liquid templating syntax. In the preview, Liquid tags are replaced with sample data for visualization.

Common Liquid variables:

- `{{ shop.name }}` - Store name
- `{{ customer.first_name }}` - Customer's first name
- `{{ order.name }}` - Order number
- `{{ order.total_price | money }}` - Formatted order total

### Control Flow

Liquid flow control is supported:

```liquid
{% for line_item in order.line_items %}
  <!-- Product row -->
{% endfor %}

{% if order.tax_price > 0 %}
  <!-- Tax information -->
{% endif %}
```

## Saving Templates

Click "Save Template" to save your work. In a production environment, this would save to your Shopify store.

## Customization

### CSS Styling

Edit the styles within the `<style>` tag in the template to change the appearance of your emails.

### Adding New Elements

Create new template elements by adding options to the `template-elements` dropdown and corresponding code snippets in the JavaScript switch statement.

## Browser Compatibility

Tested and working in:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Support

For issues or feature requests, please open an issue in the repository.
