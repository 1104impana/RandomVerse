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

    if (nextBtn && overlay) {
      nextBtn.addEventListener('click', function (e) {
        e.preventDefault();

        // Show the overlay
        overlay.style.pointerEvents = "auto";
        overlay.style.opacity = "1";

        // Redirect after animation
        setTimeout(() => {
          window.location.href = nextBtn.href;
        }, 1600); // Match with your CSS transition
      });
    }
  });

