function tellFortune() {
  const question = document.getElementById("userQuestion").value.trim();
  const messageEl = document.getElementById("ballMessage");

  if (question === "") {
    messageEl.innerText = "Ask something!";
    return;
  }

  const fortunes = [
  "In your dreams.",
  "Absolutely, without a doubt.",
  "404 Fortune Not Found.",
  "Ask your mom.",
  "The universe says yes!",
  "Better not tell you now.",
  "Nope. Not happening.",
  "The future is blurry...",
  "You already know the answer.",
  "Why are you even asking? Of course, yes.",
  "There's a chance. A slim one.",
  "Go live your life!",
  "Absolutely not.",
  "Hmm, try again later.",
  "The answer's within you.",
  "I'm just a ball, what do I know?",
  "It is certain.",
  "Without a doubt, yes!",
  "You can count on it!",
  "Yes, and then some!",
  "The stars say yes!",
  "Totally yes, no question.",
  "This one’s a yes from me!",
  "Definitely a yes — trust it.",
  "Yes, yes, yes!",
  "All signs say go ahead!",
  "Yes, with flying colors!"
];

  const randomIndex = Math.floor(Math.random() * fortunes.length);
  const message = fortunes[randomIndex];
  messageEl.innerText = message;
}
