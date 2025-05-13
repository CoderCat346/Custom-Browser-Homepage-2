document.addEventListener("DOMContentLoaded", function () {
  // Get references to key DOM elements for later use
const widgetInput = document.getElementById('widgetInput'); // Rename input to widgetInput
       // Textarea for pasting widget embed code
const saveBtn = document.getElementById('saveBtn');          // Button to save the pasted code
const container = document.getElementById('widgetContainer'); // Where the widgets will be displayed
const toggleBtn = document.getElementById('toggleBtn');      // Button to toggle the creator interface
const widgetCreator = document.getElementById('widgetCreator'); // The widget creator UI section

// When the page loads, retrieve widgets from localStorage and render them
window.onload = () => {
  // Get widget HTML array from localStorage or use empty array if none found
  const stored = JSON.parse(localStorage.getItem('aqi_widgets') || '[]');
  // Render each stored widget on the page
  stored.forEach((widgetHTML, index) => renderWidget(widgetHTML, index));
};

// Toggle the widget creator UI when user clicks the toggle button
toggleBtn.addEventListener('click', () => {
  if (widgetCreator.style.display === 'none') {
    widgetCreator.style.display = 'block';                   // Show the interface
    toggleBtn.textContent = 'Hide Widget Creator';           // Change button text accordingly
  } else {
    widgetCreator.style.display = 'none';                    // Hide the interface
    toggleBtn.textContent = 'Show Widget Creator';           // Reset button text
  }
});

// Save widget logic when "Add Widget" button is clicked
saveBtn.addEventListener('click', () => {
  const code = widgetInput.value.trim(); // Remove surrounding whitespace

  // Basic validation: must contain AQI widget structure and <script>
  if (!code.includes('data-aqi-widget-payload') || !code.includes('<script')) {
    alert("❌ Please paste a valid AQI widget embed code."); // Notify user of invalid input
    return;
  }

  // Parse saved widgets or use empty array
  const widgets = JSON.parse(localStorage.getItem('aqi_widgets') || '[]');
  widgets.push(code); // Add new code to array
  localStorage.setItem('aqi_widgets', JSON.stringify(widgets)); // Save updated array

  renderWidget(code, widgets.length - 1); // Render the newly added widget
  widgetInput.value = ''; // Clear the input field
});

// Function to render a widget's HTML code inside a styled container
function renderWidget(widgetHTML, index) {
  const wrapper = document.createElement('div'); // Outer container for widget
  // Styling the widget block
  wrapper.style.marginBottom = '20px';
  wrapper.style.border = '1px solid #ddd';
  wrapper.style.borderRadius = '10px';
  wrapper.style.padding = '10px';
  wrapper.style.background = '#fff';
  wrapper.style.boxShadow = '0 1px 4px rgba(0,0,0,0.1)';
  wrapper.setAttribute('draggable', true);         // Optional: future drag/drop use
  wrapper.setAttribute('data-index', index);       // Track position for reorder/removal

  // Optional label to identify the widget
  const label = document.createElement('h3');
  label.textContent = `Weather Widget ${index + 1}`;
  label.style.fontSize = '16px';
  label.style.color = '#2c3e50';
  label.style.marginBottom = '10px';
  wrapper.appendChild(label);

  // Use an iframe to safely render the third-party widget HTML
  const iframe = document.createElement('iframe');
  iframe.style.width = '100%';
  iframe.style.height = '300px';
  iframe.style.border = 'none';

  wrapper.appendChild(iframe); // Add iframe to wrapper

  // Add a "Remove" button for user to delete this widget
  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Remove Widget';
  removeBtn.style.backgroundColor = '#e74c3c';     // Red color for destructive action
  removeBtn.style.color = 'white';
  removeBtn.style.border = 'none';
  removeBtn.style.padding = '5px 10px';
  removeBtn.style.fontSize = '14px';
  removeBtn.style.borderRadius = '5px';
  removeBtn.style.marginTop = '10px';
  // When clicked, call removeWidget()
  removeBtn.onclick = () => removeWidget(index, wrapper);

  wrapper.appendChild(removeBtn);      // Add remove button to wrapper
  container.appendChild(wrapper);      // Add full widget container to the page

  // Dynamically inject widget HTML into iframe for safe rendering
  iframe.contentWindow.document.open();
  iframe.contentWindow.document.write(widgetHTML);
  iframe.contentWindow.document.close();
}

// Removes widget from both the DOM and localStorage
function removeWidget(index, wrapper) {
  const confirmed = confirm("Are you sure you want to remove this widget?");
  if (confirmed) {
    // Retrieve current widgets
    const widgets = JSON.parse(localStorage.getItem('aqi_widgets') || '[]');
    widgets.splice(index, 1); // Remove the selected widget by index
    localStorage.setItem('aqi_widgets', JSON.stringify(widgets)); // Update storage
    container.removeChild(wrapper); // Remove widget element from the page
  }
}
});