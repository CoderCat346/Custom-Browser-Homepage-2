function updateClock() {
    const clockElement = document.getElementById('Clock');
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    clockElement.textContent = timeString;
  }
  
  setInterval(updateClock, 1000);
  updateClock(); // initial call
  