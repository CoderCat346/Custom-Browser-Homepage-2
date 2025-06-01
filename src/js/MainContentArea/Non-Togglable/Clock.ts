function updateClock(): void {
  const clockElement = document.getElementById('Clock');
  if (clockElement) {
    const now: Date = new Date();
    const timeString: string = now.toLocaleTimeString();
    clockElement.textContent = timeString;
  }
}

setInterval(updateClock, 1000);
updateClock(); // initial call
