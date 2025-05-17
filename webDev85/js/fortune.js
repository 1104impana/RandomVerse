// Array of fortunes — wholesome, fun, sarcastic
const fortunes = [
  "You will have a great day!",
  "Adventure awaits you.",
  "Good news is coming soon.",
  "Trust your instincts.",
  "Something wonderful is about to happen.",
  "The Wi-Fi will be extra fast today.",
  "Don’t worry, nobody noticed that embarrassing thing you did.",
  "Your future self is judging your current snack choices.",
  "Someone is thinking about you... it's probably your mom.",
  "A pleasant surprise is in store for you. Or not.",
  "Today is a good day to stay in bed.",
  "Your bank account will soon experience mild disappointment.",
  "Your crush secretly knows you exist. Maybe.",
  "A random cat will cross your path and improve your mood.",
  "The fortune you seek is in another cookie.",
  "Beware of Mondays. Always.",
  "Your lucky number today is... not so lucky.",
  "You will master JavaScript. Eventually.",
  "An awkward conversation is approaching.",
  "Smile. It confuses people.",
  "Tomorrow, you might accidentally become a meme.",
  "You're doing great. At pretending to be productive.",
  "The universe is plotting something good for you. Hang in there.",
  "Your next snack will be legendary.",
  "You’ll find money on the ground soon. But it won’t be yours.",
  "Some days you eat the cookie, some days the cookie eats you.",
  "Destiny called. You didn’t pick up."
];

// Function to pick a random fortune
function getRandomFortune() {
  const randomIndex = Math.floor(Math.random() * fortunes.length);
  return fortunes[randomIndex];
}

// Function to show the fortune on screen
function showFortune() {
  const fortuneText = getRandomFortune();
  const messageBox = document.getElementById("fortuneMessage");
  messageBox.innerText = fortuneText;
  messageBox.style.display = "block";
}

// Attach event listener to cookie image
document.addEventListener("DOMContentLoaded", () => {
  const cookieImg = document.getElementById("cookieImage");
  cookieImg.addEventListener("click", showFortune);
});
