function playLaugh() {
  var audio = document.getElementById("laughSound");
  audio.play();
}

function askCrystalBall() {
  playLaugh();

  const question = document.getElementById("userQuestion").value.trim();
  const messageEl = document.getElementById("ballMessage");

  if (question === "") {
    messageEl.innerText = "Ask something!";
    return;
  }

  fetch(`https://randomverse.onrender.com/crystalBallAnswer?question=${encodeURIComponent(question)}`)
    .then(response => response.json())
    .then(data => {
      if (data.crystalBallAnswer) {
        messageEl.innerText = data.crystalBallAnswer;
      } else {
        messageEl.innerText = "The spirits are speechless...";
      }
    })
    .catch(error => {
      console.error("Error fetching crystal ball answer:", error);
      messageEl.innerText = "The crystal ball is clouded. Try again later.";
    });
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
