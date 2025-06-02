let isBroken = false;

async function breakCookie() {
  const cookieBox = document.getElementById("cookieBox");
  const cookieImg = document.getElementById("cookieImage");
  const messageBox = document.getElementById("fortuneMessage");

  cookieBox.classList.add("shake");

  setTimeout(async () => {
    if (!isBroken) {
      cookieImg.src = "images/cook2.png";

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
      cookieImg.src = "images/cook1.png";
      messageBox.classList.remove("show-message");
    }
    isBroken = !isBroken;
  }, 50);

  setTimeout(() => {
    cookieBox.classList.remove("shake");
  }, 800);
}


// On window load, randomize cookies' position, size, animation delay
window.onload = function () {
  var cookies = document.querySelectorAll('.cookie');
  var count = cookies.length;
  var segmentWidth = 1 / count; // Horizontal segments for spacing

  cookies.forEach(function (cookie, index) {
    // Random horizontal position inside the segment with padding
    var paddingX = 0.1 * segmentWidth;
    var minPosX = segmentWidth * index + paddingX;
    var maxPosX = segmentWidth * (index + 1) - paddingX;
    var randomX = Math.random() * (maxPosX - minPosX) + minPosX;
    cookie.style.setProperty('--random-x', randomX);

    // Random vertical start position between 100% (bottom) and 140% (below screen)
    var minPosY = 1.0;
    var maxPosY = 1.4;
    var randomY = Math.random() * (maxPosY - minPosY) + minPosY;
    cookie.style.setProperty('--random-y', randomY);

    // Random cookie size between 20px and 40px
    var randomSize = 20 + Math.random() * 20;
    cookie.style.width = randomSize + "px";

    // Random animation delay up to 5 seconds
    var randomDelay = Math.random() * 5;
    cookie.style.animationDelay = randomDelay + "s";
  });
};
