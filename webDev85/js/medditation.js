const sounds = {
  rain: "audio/rain-sounds-ambience-351115.mp3",
  ocean: "audio/ocean-waves-112906.mp3",
  birds: "audio/chirping-birds-ambience-217410.mp3",
  bowl: "audio/singing-bowl-hit-3-33366.mp3",
  fire: "audio/firewood-burning-sound-179862.mp3",
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


  volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value / 100;
  });

  // Keyboard support
  item.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      item.click();
    }
  });
});
document.getElementById("pauseAll").addEventListener("click", () => {
  for (const audio of Object.values(audioPlayers)) {
    audio.pause();
  }

  document.querySelectorAll(".sound-item").forEach(item => {
    item.classList.remove("playing");
  });
});
