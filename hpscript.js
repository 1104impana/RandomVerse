window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
        document.body.classList.add('scrolled');
    } else {
        document.body.classList.remove('scrolled');
    }
});

// Animation for the home page entrance
window.addEventListener('DOMContentLoaded', function() {
    const welcomeMessage = document.querySelector('.welcome-message');
    welcomeMessage.classList.add('animate');
});
