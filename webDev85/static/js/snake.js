// Game Constants & Variables
let inputDir = {x: 0, y: 0}; 
const foodSound = new Audio('/static/images/sfood.mp3');
const gameOverSound = new Audio('/static/images/swrong.mp3');
const moveSound = new Audio('/static/images/sdirection.mp3');
const musicSound = new Audio('/static/images/sbg.mp3');
let speed = 10;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [
    {x: 13, y: 15}
];

let food = {x: 6, y: 7};

// Game Functions
function main(ctime) {
    window.requestAnimationFrame(main);
    if((ctime - lastPaintTime)/1000 < 1/speed){
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // If you bump into yourself 
    for (let i = 1; i < snake.length; i++) {
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
            return true;
        }
    }
    // If you bump into the wall
   if (snake[0].x > 18 || snake[0].x < 1 || snake[0].y > 18 || snake[0].y < 1)
{
        return true;
    }
    return false;
}

function generateSafeFood() {
    let a = 2, b = 16;
    let newFood;
    do {
        newFood = {
            x: Math.round(a + (b - a) * Math.random()),
            y: Math.round(a + (b - a) * Math.random())
        };
    } while (snakeArr.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
}

function gameEngine(){
    // Part 1: Updating the snake array & Food
    if(isCollide(snakeArr)){
        gameOverSound.play();
        musicSound.pause();
        inputDir =  {x: 0, y: 0}; 
        alert("Game Over. Press any key to play again!");
        snakeArr = [{x: 13, y: 15}];
        musicSound.volume = 0.4;
        musicSound.play();
        score = 0;
        scoreBox.innerHTML = "Score: " + score;
    }

    // If the snake eats the food
    if(snakeArr[0].y === food.y && snakeArr[0].x === food.x){
        foodSound.play();
        score += 10;

        if(score > hiscoreval){
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        }

        scoreBox.innerHTML = "Score: " + score;

        // 🍴 Add new block at the tail
        let lastSegment = snakeArr[snakeArr.length - 1];
        snakeArr.push({ x: lastSegment.x, y: lastSegment.y });

        // 🍎 Generate new food at safe location
        food = generateSafeFood();
    }

    // Moving the snake body
    for (let i = snakeArr.length - 2; i >= 0; i--) { 
        snakeArr[i+1] = {...snakeArr[i]};
    }

    // Moving the head
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Display the snake and Food
    board.innerHTML = "";

    // Draw the snake
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add(index === 0 ? 'head' : 'snake');
        board.appendChild(snakeElement);
    });

    // Draw the food
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Main logic starts here
musicSound.play();

let hiscore = localStorage.getItem("hiscore");
if(hiscore === null){
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
} else {
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
}

window.requestAnimationFrame(main);

window.addEventListener('keydown', e => {
    inputDir = {x: 0, y: 1}; // Start the game
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            inputDir.x = 0;
            inputDir.y = -1;
            break;
        case "ArrowDown":
            inputDir.x = 0;
            inputDir.y = 1;
            break;
        case "ArrowLeft":
            inputDir.x = -1;
            inputDir.y = 0;
            break;
        case "ArrowRight":
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        default:
            break;
    }
});
let touchStartX = 0;
let touchStartY = 0;

window.addEventListener("touchstart", function(e){
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, false);

window.addEventListener("touchend", function(e){
    let touchEndX = e.changedTouches[0].screenX;
    let touchEndY = e.changedTouches[0].screenY;

    let dx = touchEndX - touchStartX;
    let dy = touchEndY - touchStartY;

    // Determine swipe direction
    if(Math.abs(dx) > Math.abs(dy)){
        if(dx > 0){
            inputDir = {x:1, y:0}; // Right
        } else {
            inputDir = {x:-1, y:0}; // Left
        }
    } else {
        if(dy > 0){
            inputDir = {x:0, y:1}; // Down
        } else {
            inputDir = {x:0, y:-1}; // Up
        }
    }
    moveSound.play();
}, false);

