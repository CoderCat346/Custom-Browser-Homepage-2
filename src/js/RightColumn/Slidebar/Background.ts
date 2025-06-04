document.addEventListener('DOMContentLoaded', () => {
  // Toggle background changer UI
  function toggleBackgroundChanger(): void {
    const wrapper = document.getElementById('backgroundChangerWrapper');
    if (wrapper) {
      wrapper.classList.toggle('expanded');
    }
  }

  // Image options
  interface ImageOption {
    label: string;
    url: string;
  }

  const imageOptions: ImageOption[] = [
    { label: 'Horizon', url: 'assets/images/Horizon.webp' },
    { label: 'Mountain', url: 'assets/images/Mountain.webp' },
    { label: 'Mountain 2', url: 'assets/images/Mountain_2.webp' },
    { label: 'Mountain 3', url: 'assets/images/Mountain_3.webp' },
    { label: 'Stars', url: 'assets/images/Stars.webp' },
    { label: 'Dessert', url: 'assets/images/Dessert.webp' },
    { label: 'Shore', url: 'assets/images/Shore.webp' },
    { label: 'Shore 2', url: 'assets/images/Shore_2.webp' },
    { label: 'Astronomy', url: 'assets/images/Astronomy.webp' },
    { label: 'Scenery', url: 'assets/images/Scenery.webp' },
    { label: 'Clouds', url: 'assets/images/Clouds.webp' },
    { label: 'Shapes', url: 'assets/images/Shapes.webp' },
    { label: 'Stocks', url: 'assets/images/Stocks.webp' },
    { label: 'Study', url: 'assets/images/Study.webp' },
  ];
  // Big thanks to https://github.com/faizanusmani20

  // Render background options UI
  function renderOptions(type: 'color' | 'image'): void {
    const container = document.getElementById('optionsContainer');
    if (!container) return;
    container.innerHTML = '';
    const savedValue = localStorage.getItem('bgValue');

    if (type === 'color') {
      const colorInput = document.createElement('input');
      colorInput.type = 'color';
      colorInput.value = savedValue || '#888888'; // default non-white

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

      if (savedValue) updateColorPreview(savedValue);
    } else if (type === 'image') {
      imageOptions.forEach(img => {
        const label = document.createElement('label');
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.style.marginBottom = '8px';
        label.style.cursor = 'pointer';

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'bgImage';
        radio.value = img.url;
        if (img.url === savedValue) radio.checked = true;

        radio.addEventListener('change', () => setBgImage(img.url));

        const imgPreview = document.createElement('img');
        imgPreview.src = img.url;
        imgPreview.alt = img.label;
        imgPreview.style.width = '60px';
        imgPreview.style.height = '40px';
        imgPreview.style.objectFit = 'cover';
        imgPreview.style.marginLeft = '8px';
        imgPreview.style.borderRadius = '6px';

        label.appendChild(radio);
        label.append(` ${img.label}`);
        label.appendChild(imgPreview);
        container.appendChild(label);
      });
    }
  }

  // Color preview handler
  function updateColorPreview(color: string): void {
    const preview = document.getElementById('colorPreview');
    if (preview) {
      preview.style.backgroundColor = color;
    }
    setBgColor(color);
  }

  // Set color background
  function setBgColor(color: string): void {
    document.body.style.backgroundImage = '';
    document.body.style.backgroundColor = color;
    localStorage.setItem('bgType', 'color');
    localStorage.setItem('bgValue', color);
  }

  // Set image background
  function setBgImage(imageUrl: string): void {
    document.body.style.backgroundColor = '';
    document.body.style.backgroundImage = `url(${imageUrl})`;
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    localStorage.setItem('bgType', 'image');
    localStorage.setItem('bgValue', imageUrl);
  }

  // Init on load
  window.addEventListener('DOMContentLoaded', () => {
    const radios = document.querySelectorAll<HTMLInputElement>('input[name="bgType"]');
    radios.forEach(radio => {
      radio.addEventListener('change', e => {
        const target = e.target as HTMLInputElement;
        renderOptions(target.value as 'color' | 'image');
      });
    });

    let bgType = localStorage.getItem('bgType') as 'color' | 'image' | null;
    let bgValue = localStorage.getItem('bgValue');

    // Default to first image if nothing is stored
    if (!bgType || !bgValue) {
      bgType = 'image';
      bgValue = imageOptions[0].url;
      localStorage.setItem('bgType', bgType);
      localStorage.setItem('bgValue', bgValue);
    }

    // Render background options BEFORE applying
    renderOptions(bgType);

    // Apply the saved or default background
    if (bgType === 'color') {
      setBgColor(bgValue!);
      (document.querySelector('input[value="color"]') as HTMLInputElement).checked = true;
    } else if (bgType === 'image') {
      setBgImage(bgValue!);
      (document.querySelector('input[value="image"]') as HTMLInputElement).checked = true;
    }
  });
});
