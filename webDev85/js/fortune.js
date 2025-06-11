let brokenCookies = {
  "main": false,
  "corner": false,
  "right-corner": false,
  "between-corner": false,
  "place-corner": false,
};

function getRandomFortune() {
  const messages = [
    "Your future is full of cookies 🍪",
    "Hard work pays off soon!",
    "Believe in yourself 🌟",
    "Luck is on your side today!",
    "Good things take time 💫"
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

async function breakCookie(position = "main") {
  const cookieImg = document.querySelector(`#cookieBox${position !== "main" ? "-" + position : ""} .cookie-img`);
  const messageBox = document.querySelector(`#cookieBox${position !== "main" ? "-" + position : ""} .message-box`);
  const isBroken = brokenCookies[position];

  cookieImg.classList.add("shake");

  setTimeout(() => {
    if (!isBroken) {
      cookieImg.src = "images/break4.png";
      messageBox.textContent = getRandomFortune();
      messageBox.classList.add("show-message");
      brokenCookies[position] = true;
    }
  }, 400);
}
