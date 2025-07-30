let brokenCookies = {};
let autoCloseTimeouts = {}; // to track individual cookie auto-close timers

async function breakCookie(position) {
  const cookieImg = document.getElementById("cookieImage" + position);
  const messageBox = document.getElementById("fortuneMessage" + position);
  const cookieBox = cookieImg.parentElement;

  if (!brokenCookies[position]) {
    // Start continuous shake animation
    cookieBox.classList.add("shake");
    const shakeInterval = setInterval(() => {
      cookieBox.classList.remove("shake");
      void cookieBox.offsetWidth;
      cookieBox.classList.add("shake");
    }, 600);

    try {
      // Fetch fortune from Flask LLM endpoint
      const response = await fetch('https://randomverse.onrender.com/getFortuneLLM');
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();

      // Clear shake
      clearInterval(shakeInterval);
      cookieBox.classList.remove("shake");

      // Break cookie image
      cookieImg.src = "/static/images/break4.png";

      const crackSound = new Audio("/static/images/crunch.mp3");
crackSound.play();

      // Show message after slight delay
      setTimeout(() => {
        messageBox.textContent = data.message || "No fortune received.";
        messageBox.classList.add("show-message");

        // Auto-close after 5 seconds if user doesn't click
        autoCloseTimeouts[position] = setTimeout(() => {
          closeCookie(position);
        }, 5000);

      }, 400);

    } catch (error) {
      clearInterval(shakeInterval);
      cookieBox.classList.remove("shake");
      messageBox.textContent = "Error fetching fortune.";
      console.error("Fetch error:", error);
    }

  } else {
    // If already broken, restore immediately
    closeCookie(position);
  }

  // Toggle state
  brokenCookies[position] = !brokenCookies[position];
}

// Function to reset cookie image & message
function closeCookie(position) {
  const cookieImg = document.getElementById("cookieImage" + position);
  const messageBox = document.getElementById("fortuneMessage" + position);

  // Restore cookie image and hide message
  cookieImg.src = "/static/images/cook4.png";
  messageBox.classList.remove("show-message");

  // Clear any existing timeout if closing manually
  if (autoCloseTimeouts[position]) {
    clearTimeout(autoCloseTimeouts[position]);
    delete autoCloseTimeouts[position];
  }

  // Mark cookie as closed
  brokenCookies[position] = false;
}


document.addEventListener("DOMContentLoaded", function () {
  const nextBtn = document.querySelector('.hero-btn[href*="next_verse"]');
  const overlay = document.getElementById('transition-overlay');
  const typewriter = document.getElementById('typewriter-text');

  function typeText(text, element, speed, callback) {
    let index = 0;
    function typeChar() {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        setTimeout(typeChar, speed);
      } else {
        if (callback) callback();
      }
    }
    typeChar();
  }

  if (nextBtn && overlay && typewriter) {
    nextBtn.addEventListener('click', function (e) {
      e.preventDefault();

      overlay.style.opacity = "1";
      overlay.style.pointerEvents = "auto";
      typewriter.textContent = ""; // Clear any previous text

      const fullText = "Travelling to next verse...";
      const typingSpeed = 80; // in milliseconds

      typeText(fullText, typewriter, typingSpeed, function () {
        // Redirect after typing completes
        setTimeout(() => {
          window.location.href = nextBtn.href;
        }, 500);
      });
    });
  }
});

 