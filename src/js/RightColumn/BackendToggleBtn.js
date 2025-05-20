// BackendToggleBtn.js
// Controls the backend toggle button and modal UI for selecting backend preference.

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('backendModal');
  const toggleBtn = document.querySelector('.BackendToggleBtn');
  const form = document.getElementById('backendChoiceForm');
  const inputField = document.getElementById('customBackendInput');
  const closeBtn = modal.querySelector('.CloseBtn');

  // Load saved backend preference on modal open and prefill form fields
  function prefillForm() {
    const savedPref = window.ApiRouter.getBackendPref();

    if (savedPref === 'direct' || savedPref === 'default') {
      form.elements['backend'].value = savedPref;
      inputField.value = '';
      inputField.disabled = true;
    } else if (savedPref.startsWith('custom:')) {
      form.elements['backend'].value = 'custom';
      inputField.value = savedPref.slice(7);
      inputField.disabled = false;
    } else {
      form.elements['backend'].value = 'default';
      inputField.value = '';
      inputField.disabled = true;
    }
  }

  // Enable or disable input field based on backend choice
  form.elements['backend'].forEach(radio => {
    radio.addEventListener('change', () => {
      inputField.disabled = (form.elements['backend'].value !== 'custom');
      if (inputField.disabled) inputField.value = '';
    });
  });

  // Show modal when toggle button clicked
  toggleBtn.addEventListener('click', () => {
    prefillForm();
    modal.style.display = 'block';
  });

  // Close modal when ❌ clicked
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Close modal when clicking outside modal content
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Handle form submission - save preference and close modal
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const choice = form.elements['backend'].value;

    if (choice === 'custom') {
      const url = inputField.value.trim();
      if (url) {
        window.ApiRouter.setBackendPref(`custom:${url}`);
      } else {
        alert("Please enter a valid custom backend URL.");
        return;
      }
    } else {
      window.ApiRouter.setBackendPref(choice);
    }

    modal.style.display = 'none';
  });
});
