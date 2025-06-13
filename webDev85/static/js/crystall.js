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

  fetch(`http://localhost:5000/crystalBallAnswer?question=${encodeURIComponent(question)}`)
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
