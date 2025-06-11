let isBroken = false;

async function breakCookie() {
  const cookieBox = document.getElementById("cookieBox");
  const cookieImg = document.getElementById("cookieImage");
  const messageBox = document.getElementById("fortuneMessage");

  cookieBox.classList.add("shake");

  setTimeout(async () => {
    if (!isBroken) {
      cookieImg.src = "images/break4.png";

      try {
        // Fetch fortune from Flask LLM endpoint
        const response = await fetch('http://localhost:5000/getFortuneLLM'); // Change to your LLM endpoint
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();

        // Assuming your Flask returns { "message": "fortune text" }
        messageBox.textContent = data.message || "No fortune received.";
      } catch (error) {
        messageBox.textContent = "Error fetching fortune.";
        console.error("Fetch error:", error);
      }

      messageBox.classList.add("show-message");
    } else {
      cookieImg.src = "images/cook4.png";
      messageBox.classList.remove("show-message");
    }
    isBroken = !isBroken;
  }, 50);

  setTimeout(() => {
    cookieBox.classList.remove("shake");
  }, 800);
}

