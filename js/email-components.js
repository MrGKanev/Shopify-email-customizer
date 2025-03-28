/**
 * Email Components for WYSIWYG Editor
 * 
 * This file provides specialized components and tools for email template editing
 * in the Quill WYSIWYG editor. It adds custom formats and tools for common
 * email template elements like buttons, dividers, and specialized layouts.
 */

// Initialize email components when Quill is ready
document.addEventListener('quillReady', initEmailComponents);

function initEmailComponents() {
  // Add button for inserting email components
  addEmailComponentsButton();
  
  // Create the components modal
  createComponentsModal();
}

// Add email components button to Quill toolbar
function addEmailComponentsButton() {
  const qlToolbar = document.querySelector('.ql-toolbar');
  
  if (qlToolbar && !document.getElementById('email-components-btn')) {
    // Add separator
    const separator = document.createElement('span');
    separator.className = 'ql-formats';
    qlToolbar.appendChild(separator);
    
    // Create components button
    const componentsBtn = document.createElement('button');
    componentsBtn.id = 'email-components-btn';
    componentsBtn.className = 'ql-components';
    componentsBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path fill="currentColor" d="M4,2H20A2,2 0 0,1 22,4V20A2,2 0 0,1 20,22H4A2,2 0 0,1 2,20V4A2,2 0 0,1 4,2M4,4V20H20V4H4M6,6H18V8H6V6M6,10H18V12H6V10M6,14H18V16H6V14M6,18H12V20H6V18Z"></path>
      </svg>
    `;
    componentsBtn.title = 'Email Components';
    
    // Add click event
    componentsBtn.addEventListener('click', function() {
      document.getElementById('email-components-modal').classList.remove('hidden');
    });
    
    qlToolbar.appendChild(componentsBtn);
  }
}

// Create email components modal
function createComponentsModal() {
  // Check if modal already exists
  if (document.getElementById('email-components-modal')) {
    return;
  }
  
  // Create modal container
  const modal = document.createElement('div');
  modal.id = 'email-components-modal';
  modal.className = 'hidden fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-labelledby', 'email-components-title');
  modal.setAttribute('aria-modal', 'true');
  
  // Create modal content
  modal.innerHTML = `
    <div class="relative mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
      <div class="flex justify-between items-center mb-4">
        <h3 id="email-components-title" class="text-lg font-medium">Email Components</h3>
        <button class="close-modal text-gray-400 hover:text-gray-500" aria-label="Close modal">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <div id="email-components-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        <!-- Components will be inserted here -->
      </div>
    </div>
  `;
  
  // Add modal to document
  document.body.appendChild(modal);
  
  // Add event listeners
  modal.querySelector('.close-modal').addEventListener('click', function() {
    modal.classList.add('hidden');
  });
  
  // Close when clicking outside
  modal.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.classList.add('hidden');
    }
  });
  
  // Populate with components
  populateComponentsModal();
}

// Define email components
const emailComponents = [
  {
    id: 'button',
    name: 'Button',
    description: 'Call-to-action button',
    icon: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M4,5A2,2 0 0,0 2,7V17A2,2 0 0,0 4,19H20A2,2 0 0,0 22,17V7A2,2 0 0,0 20,5H4M4,7H20V17H4V7M5,8V10H7V8H5M8,8V10H10V8H8M11,8V10H13V8H11M14,8V10H16V8H14M17,8V10H19V8H17Z"></path></svg>',
    html: `<a href="#" style="display: inline-block; background-color: #3490dc; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; text-align: center;">Click Here</a>`
  },
  {
    id: 'divider',
    name: 'Divider',
    description: 'Horizontal line divider',
    icon: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M19,13H5V11H19V13Z"></path></svg>',
    html: `<hr style="border: 0; height: 1px; background-color: #e2e8f0; margin: 24px 0;">`
  },
  {
    id: 'spacer',
    name: 'Spacer',
    description: 'Vertical spacing',
    icon: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M13,11H11V19H13V11M13,5H11V9H13V5M12,1A10,10 0 0,0 2,11A10,10 0 0,0 12,21A10,10 0 0,0 22,11A10,10 0 0,0 12,1Z"></path></svg>',
    html: `<div style="height: 32px;"></div>`
  },
  {
    id: 'two-columns',
    name: 'Two Columns',
    description: 'Two-column layout',
    icon: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M2,5V19H22V5H2M4,7H10V17H4V7M12,7H20V17H12V7Z"></path></svg>',
    html: `<table style="width: 100%; border-collapse: collapse;">
  <tr>
    <td style="width: 50%; padding: 8px; vertical-align: top;">
      Left column content goes here.
    </td>
    <td style="width: 50%; padding: 8px; vertical-align: top;">
      Right column content goes here.
    </td>
  </tr>
</table>`
  },
  {
    id: 'three-columns',
    name: 'Three Columns',
    description: 'Three-column layout',
    icon: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M2,5V19H22V5H2M4,7H8V17H4V7M10,7H14V17H10V7M16,7H20V17H16V7Z"></path></svg>',
    html: `<table style="width: 100%; border-collapse: collapse;">
  <tr>
    <td style="width: 33.33%; padding: 8px; vertical-align: top;">
      Left column content.
    </td>
    <td style="width: 33.33%; padding: 8px; vertical-align: top;">
      Middle column content.
    </td>
    <td style="width: 33.33%; padding: 8px; vertical-align: top;">
      Right column content.
    </td>
  </tr>
</table>`
  },
  {
    id: 'image-text',
    name: 'Image + Text',
    description: 'Image with text beside it',
    icon: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M21,3H3C2,3 1,4 1,5V19A2,2 0 0,0 3,21H21C22,21 23,20 23,19V5C23,4 22,3 21,3M5,17L8.5,12.5L11,15.5L14.5,11L19,17H5Z"></path></svg>',
    html: `<table style="width: 100%; border-collapse: collapse;">
  <tr>
    <td style="width: 30%; padding: 8px; vertical-align: top;">
      <img src="https://via.placeholder.com/150" style="max-width: 100%; height: auto;">
    </td>
    <td style="width: 70%; padding: 8px; vertical-align: top;">
      <h3 style="margin-top: 0;">Image Caption</h3>
      <p>Description text goes here. You can describe the image or add any relevant content.</p>
    </td>
  </tr>
</table>`
  },
  {
    id: 'callout',
    name: 'Callout Box',
    description: 'Highlighted information box',
    icon: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"></path></svg>',
    html: `<div style="background-color: #f8f9fa; border-left: 4px solid #3490dc; padding: 16px; margin: 16px 0;">
  <h4 style="margin-top: 0; color: #3490dc;">Important Note</h4>
  <p style="margin-bottom: 0;">This is a callout box that can highlight important information in your email.</p>
</div>`
  },
  {
    id: 'product-card',
    name: 'Product Card',
    description: 'Product display with image and details',
    icon: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12,13A5,5 0 0,1 7,8H9A3,3 0 0,0 12,11A3,3 0 0,0 15,8H17A5,5 0 0,1 12,13M12,3A3,3 0 0,1 15,6H9A3,3 0 0,1 12,3M19,6H17A5,5 0 0,0 12,1A5,5 0 0,0 7,6H5C3.89,6 3,6.89 3,8V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V8C21,6.89 20.1,6 19,6Z"></path></svg>',
    html: `<div style="border: 1px solid #e2e8f0; border-radius: 4px; overflow: hidden; margin: 16px 0;">
  <div style="padding: 16px; display: flex; align-items: center;">
    <div style="flex: 0 0 100px; margin-right: 16px;">
      <img src="https://via.placeholder.com/100" style="max-width: 100%; height: auto; display: block;">
    </div>
    <div>
      <h3 style="margin-top: 0; margin-bottom: 8px;">Product Name</h3>
      <p style="margin-bottom: 8px; color: #718096;">Category</p>
      <p style="margin-bottom: 8px;"><strong>$29.99</strong></p>
      <a href="#" style="display: inline-block; background-color: #3490dc; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-size: 14px;">Buy Now</a>
    </div>
  </div>
</div>`
  },
  {
    id: 'quote',
    name: 'Testimonial Quote',
    description: 'Customer testimonial with attribution',
    icon: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M10,7L8,11H11V17H5V11L7,7H10M18,7L16,11H19V17H13V11L15,7H18Z"></path></svg>',
    html: `<blockquote style="border-left: 4px solid #cbd5e0; padding-left: 16px; margin: 16px 0; font-style: italic; color: #4a5568;">
  <p>"This is an amazing product that completely solved our problem. The customer service was excellent too!"</p>
  <footer style="margin-top: 8px; font-size: 14px; color: #718096;">— Jane Smith, CEO at Company</footer>
</blockquote>`
  },
  {
    id: 'footer',
    name: 'Email Footer',
    description: 'Standard email footer with social links',
    icon: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M6,13H18V11H6M3,6V8H21V6M10,18H14V16H10V18Z"></path></svg>',
    html: `<div style="margin-top: 32px; padding-top: 32px; border-top: 1px solid #e2e8f0; text-align: center; color: #718096; font-size: 14px;">
  <p>
    <a href="#" style="display: inline-block; margin: 0 8px; color: #718096; text-decoration: none;">Website</a>
    <a href="#" style="display: inline-block; margin: 0 8px; color: #718096; text-decoration: none;">Privacy Policy</a>
    <a href="#" style="display: inline-block; margin: 0 8px; color: #718096; text-decoration: none;">Unsubscribe</a>
  </p>
  <p style="margin-top: 16px;">© 2025 {{ shop.name }}. All rights reserved.</p>
  <p style="margin-top: 8px;">{{ shop.address }}</p>
</div>`
  }
];

// Populate components modal
function populateComponentsModal() {
  const container = document.getElementById('email-components-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  emailComponents.forEach(component => {
    const componentDiv = document.createElement('div');
    componentDiv.className = 'border rounded p-3 hover:bg-gray-50 cursor-pointer component-item';
    componentDiv.dataset.componentId = component.id;
    
    componentDiv.innerHTML = `
      <div class="flex items-center mb-2">
        <div class="text-indigo-600 mr-2">${component.icon}</div>
        <h4 class="font-bold">${component.name}</h4>
      </div>
      <p class="text-sm text-gray-600">${component.description}</p>
    `;
    
    componentDiv.addEventListener('click', function() {
      insertComponent(component.id);
      document.getElementById('email-components-modal').classList.add('hidden');
    });
    
    container.appendChild(componentDiv);
  });
}

// Insert a component at the cursor position
function insertComponent(componentId) {
  if (!quillEditor) return;
  
  // Find the component
  const component = emailComponents.find(c => c.id === componentId);
  if (!component) return;
  
  // Insert at cursor position
  const range = quillEditor.getSelection(true);
  quillEditor.clipboard.dangerouslyPasteHTML(range.index, component.html);
  
  // Process any liquid tags that might be in the component
  processLiquidTags();
  
  // Update the code editor
  syncToCodeEditor();
}