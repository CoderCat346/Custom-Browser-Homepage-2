// Function to toggle the visibility of the background changer section
function toggleBackgroundChanger() {
  const wrapper = document.getElementById('backgroundChangerWrapper');
  wrapper.classList.toggle('expanded');  // Toggle expanded class instead of collapsed
}

// Existing JavaScript functionality remains the same
const imageOptions = [
  { label: 'Space', url: '/assets/images/Space.webp' },
  { label: 'Mountains', url: '/assets/images/Mountains.webp' },
  { label: 'Gradient', url: '/assets/images/Gradient.webp' },
  { label: 'Forest', url: '/assets/images/Forest.webp' },
  { label: 'City', url: '/assets/images/City.webp' },
  { label: 'Architecture', url: '/assets/images/Architecture.webp' },
  { label: 'Waves', url: '/assets/images/Waves.webp' },
];

function renderOptions(type) {
  const container = document.getElementById('optionsContainer');
  container.innerHTML = '';
  const savedValue = localStorage.getItem('bgValue');

  if (type === 'color') {
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = savedValue || '#ffffff';  // Restore from localStorage (default white)
    
    colorInput.addEventListener('input', () => {
      updateColorPreview(colorInput.value);
    });
    
    const colorPreview = document.createElement('div');
    colorPreview.id = 'colorPreview';
    colorPreview.style.height = '50px';
    colorPreview.style.marginTop = '10px';
    colorPreview.style.border = '1px solid #ccc';
    
    container.appendChild(colorInput);
    container.appendChild(colorPreview);
    
    // Set initial preview
    if (savedValue) updateColorPreview(savedValue);
  } else if (type === 'image') {
    imageOptions.forEach(img => {
      const label = document.createElement('label');
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'bgImage';
      radio.value = img.url;
      if (img.url === savedValue) radio.checked = true;

      radio.addEventListener('change', () => setBgImage(img.url));
      label.appendChild(radio);
      label.append(` ${img.label}`);
      container.appendChild(label);
      container.appendChild(document.createElement('br'));
    });
  }
}

// Update the color preview and apply the background color
function updateColorPreview(color) {
  const preview = document.getElementById('colorPreview');
  preview.style.backgroundColor = color;

  setBgColor(color);
}

// Set background color based on the input
function setBgColor(color) {
  document.body.style.backgroundImage = '';
  document.body.style.backgroundColor = color;

  localStorage.setItem('bgType', 'color');
  localStorage.setItem('bgValue', color);
}

// Set background image based on the selected option
function setBgImage(imageUrl) {
  document.body.style.backgroundColor = '';
  document.body.style.backgroundImage = `url(${imageUrl})`;
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundPosition = 'center';

  localStorage.setItem('bgType', 'image');
  localStorage.setItem('bgValue', imageUrl);
}

// Initialize event listeners and load saved preferences
window.addEventListener('DOMContentLoaded', () => {
  const radios = document.querySelectorAll('input[name="bgType"]');
  radios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      renderOptions(e.target.value);
    });
  });

  // Render default selection (based on what's checked)
  const checked = document.querySelector('input[name="bgType"]:checked');
  if (checked) renderOptions(checked.value);

  // Restore user's choice on page load
  const bgType = localStorage.getItem('bgType');
  const bgValue = localStorage.getItem('bgValue');

  if (bgType === 'color') {
    setBgColor(bgValue);
    document.querySelector('input[value="color"]').checked = true;
  } else if (bgType === 'image') {
    setBgImage(bgValue);
    document.querySelector('input[value="image"]').checked = true;
  } else {
    setBgColor('#ffffff'); // Default color
  }

  // Initialize radio buttons to reflect current background type
  renderOptions(bgType || 'color');
});
