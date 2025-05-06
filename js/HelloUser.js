  // Make the section editable
  const editable = document.getElementById("editableText");
  editable.setAttribute("contenteditable", "true");

  // Load saved text from localStorage (if any)
  const savedText = localStorage.getItem("userText");
  if (savedText !== null) {
    editable.innerText = savedText;
  }

  // Save text on blur (when user clicks outside)
  editable.addEventListener("blur", function () {
    const updatedText = this.innerText;
    console.log("Saved text:", updatedText); // You can replace this with actual save logic if needed
    localStorage.setItem("userText", updatedText); // Save the updated text to localStorage
  });