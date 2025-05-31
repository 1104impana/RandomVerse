 const sounds = {
    rain: "audio/rain-sounds-ambience-351115.mp3",
    ocean: "audio/ocean-waves-112906.mp3",
    birds: "audio/chirping-birds-ambience-217410.mp3",
  };

  const audioPlayer = document.getElementById("audioPlayer");
  const soundItems = document.querySelectorAll(".sound-item");
  const togglePlayBtn = document.getElementById("togglePlay");
  const volumeSlider = document.getElementById("volumeSlider");
  const volumeValue = document.getElementById("volumeValue");

  // Initialize volume at 0.5 (50%)
  audioPlayer.volume = 0.5;

  soundItems.forEach((item) => {
    item.addEventListener("click", () => {
      const sound = item.getAttribute("data-sound");
      if (sounds[sound]) {
        audioPlayer.src = sounds[sound];
        audioPlayer.play();
        togglePlayBtn.textContent = "Pause";
        togglePlayBtn.disabled = false;
      }
    });

    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        item.click();
      }
    });
  });

  togglePlayBtn.addEventListener("click", () => {
    if (audioPlayer.paused) {
      audioPlayer.play();
      togglePlayBtn.textContent = "Pause";
    } else {
      audioPlayer.pause();
      togglePlayBtn.textContent = "Play";
    }
  });

  volumeSlider.addEventListener("input", () => {
    const vol = volumeSlider.value / 100;
    audioPlayer.volume = vol;
    volumeValue.textContent = volumeSlider.value + "%";
  });

  // Update slider and text on load (in case volume is changed elsewhere)
  function updateVolumeDisplay() {
    volumeSlider.value = Math.round(audioPlayer.volume * 100);
    volumeValue.textContent = volumeSlider.value + "%";
  }
  updateVolumeDisplay();