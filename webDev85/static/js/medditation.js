const sounds = {
  rain: "/static/images/rain.mp3",
  ocean: "/static/images/waves.mp3",
  birds: "/static/images/birds.mp3",
  bowl: "/static/images/bowl.mp3",
  fire: "/static/images/fire.mp3",
};

const audioPlayers = {}; // Store Audio objects for each sound

// Set up each sound item and its slider
document.querySelectorAll(".sound-item").forEach((item) => {
  const soundName = item.getAttribute("data-sound");
  const volumeSlider = item.querySelector(".volume-slider");

  // Create and configure audio element
  const audio = new Audio(sounds[soundName]);
  audio.loop = true;
  audio.volume = volumeSlider.value / 100;
  audioPlayers[soundName] = audio;

  // Handle click on sound box (toggle that sound)
  item.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      item.classList.add("playing");
    } else {
      audio.pause();
      item.classList.remove("playing");
    }
  });

  // Volume slider control
  volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value / 100;
  });

  // Keyboard accessibility: toggle on Enter or Space
  item.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      item.click();
    }
  });
});

// Pause All button logic
document.getElementById("pauseAll").addEventListener("click", () => {
  for (const audio of Object.values(audioPlayers)) {
    audio.pause();
  }

  document.querySelectorAll(".sound-item").forEach((item) => {
    item.classList.remove("playing");
  });
});


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

