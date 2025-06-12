let brokenCookies = {};

async function breakCookie(position) {
  const cookieImg = document.getElementById("cookieImage" + position);
  const messageBox = document.getElementById("fortuneMessage" + position);
  const cookieBox = cookieImg.parentElement;

  // Add shake animation
  cookieBox.classList.add("shake");

  setTimeout(async () => {
    if (!brokenCookies[position]) {
      cookieImg.src = "images/break4.png";

      try {
        // Fetch fortune from Flask LLM endpoint
        const response = await fetch('http://localhost:5000/getFortuneLLM');
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();

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

    // Toggle state
    brokenCookies[position] = !brokenCookies[position];
  }, 50);

  setTimeout(() => {
    cookieBox.classList.remove("shake");
  }, 800);
}
