let isBrokenMain = false;
let isBrokenCorner = false;

async function breakCookie(position = "main") {
  let cookieImg, messageBox, isBroken;

  if(position === "main") {
    cookieImg = document.getElementById("cookieImage");
    messageBox = document.getElementById("fortuneMessage");
    isBroken = isBrokenMain;
  } else if(position === "corner") {
    cookieImg = document.getElementById("cookieImageCorner");
    messageBox = document.getElementById("fortuneMessageCorner");
    isBroken = isBrokenCorner;
  }

  cookieImg.classList.add("shake");

  setTimeout(async () => {
    if (!isBroken) {
      cookieImg.src = "images/break4.png"; // or broken cookie image
      // fetch/display fortune message logic here, e.g.
      messageBox.textContent = "Your fortune message here!";
      messageBox.classList.add("show-message");

      if(position === "main") isBrokenMain = true;
      else if(position === "corner") isBrokenCorner = true;
    }
  }, 400);

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
