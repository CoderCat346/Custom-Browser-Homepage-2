// @ts-nocheck
// BackendToggleBtn.ts
// Manages backend preference modal and storage logic.

// Declare global ApiRouter if not using modules
interface ApiRouter {
  getBackendPref(): string;
  setBackendPref(pref: string): void;
  getApiBase(path: string): string | null;
  onBackendChange(callback: (pref: string) => void): void;
}

interface Window {
  ApiRouter: ApiRouter;
}

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('backendModal')!;
  const toggleBtn = document.querySelector('.BackendToggleBtn')!;
  const form = document.getElementById('backendChoiceForm') as HTMLFormElement;
  const inputField = document.getElementById('customBackendInput') as HTMLInputElement;
  const closeBtn = modal.querySelector('.CloseBtn')!;

  // Prefill form based on saved backend preference
  function prefillForm(): void {
    const savedPref = window.ApiRouter.getBackendPref();
    const backendRadios = form.elements.namedItem('backend') as RadioNodeList;

    if (savedPref === 'direct' || savedPref === 'default') {
      backendRadios.value = savedPref;
      inputField.value = '';
      inputField.disabled = true;
    } else if (savedPref.startsWith('custom:')) {
      backendRadios.value = 'custom';
      inputField.value = savedPref.slice(7);
      inputField.disabled = false;
    } else {
      backendRadios.value = 'default';
      inputField.value = '';
      inputField.disabled = true;
    }
  }

  // Toggle input field for custom backend
  Array.from(form.querySelectorAll('input[name="backend"]')).forEach((radio) => {
    (radio as HTMLInputElement).addEventListener('change', () => {
      const useCustom = (form.elements.namedItem('backend') as RadioNodeList).value === 'custom';
      inputField.disabled = !useCustom;
      if (!useCustom) inputField.value = '';
    });
  });

  // Show modal on button click
  toggleBtn.addEventListener('click', () => {
    prefillForm();
    modal.style.display = 'block';
  });

  // Hide modal on ❌ click
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Hide modal on outside click
  window.addEventListener('click', (e: MouseEvent) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Save backend preference
  form.addEventListener('submit', (e: Event) => {
    e.preventDefault();
    const backendChoice = (form.elements.namedItem('backend') as RadioNodeList).value;

    if (backendChoice === 'custom') {
      const url = inputField.value.trim();
      if (url) {
        window.ApiRouter.setBackendPref(`custom:${url}`);
      } else {
        alert('Please enter a valid custom backend URL.');
        return;
      }
    } else {
      window.ApiRouter.setBackendPref(backendChoice);
    }

    modal.style.display = 'none';
  });
});