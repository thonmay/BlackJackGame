let cards = [];
let sum;
let hasBlackJack = false;
let isAlive = true;
let message = "";

//Elements
const msgEl = document.getElementById("msgEl");
const cardEl = document.getElementById("cardEl");
const sumEl = document.getElementById("sumEl");
const gameContainer = document.getElementById("game-container");
const startBtn = document.getElementById("start-btn");

//Initial Message
msgEl.textContent = "Wanna play a game of Black Jack?";
startBtn.style.visibility = 'visible';

function getRandomCard() {
    return Math.floor(Math.random() * 10 + 2);   //A card between 2 and 11
}

function startGame()
{
    isAlive = true;
    hasBlackJack = false;
    cards = [getRandomCard(), getRandomCard()];
    renderGame();
    startBtn.style.visibility = 'hidden';
}

function resetGame()
{
    cards = [];
    startBtn.style.visibility = 'visible';
}


function renderGame() {
    
    sum = cards.reduce( (total, card) => total + card, 0);
    console.log(cards.join(", "));
    if(sum <= 20) {
        message = "Do you want to draw a new card?🙂 ";
    } else if (sum === 21) {
        message = "You've got Blackjack!🤩";
        hasBlackJack = true;
        isAlive = false;
        celebrateWin();
        resetGame();
    } else {
        message = "You're out of the game!😒";
        isAlive = false;
        showFailure();
        setTimeout(resetGame, 1000);
        //resetGame();
    }
    cardEl.textContent = "Cards: " + cards.join(" ");
    sumEl.textContent = "Sum: " + sum;
    msgEl.textContent = message;
}

function newCard()
{
    // Only allow drawing a card if the game is still active
    if (isAlive && !hasBlackJack) {
        let newCard = getRandomCard();
        cards.push(newCard);
        sum += newCard;
        renderGame();
    }
}



// Win celebration function
function celebrateWin() {
    // Change background with transition
    gameContainer.backgroundColor = "#1a9c50"; // Festive green
    console.log("win")
    
    // Create confetti
    createConfetti(100); // Create 100 confetti pieces
    
    
    //Add a subtle animation to the game container
    if (gameContainer) {
        gameContainer.classList.add('celebrate-animation');
        setTimeout(() => {
            gameContainer.classList.remove('celebrate-animation');
        }, 3000);
    }
}

function showFailure() {
    // Change background to red with transition
    gameContainer.backgroundColor = "#d9534f"; // Sad red
    console.log("failure")
    
    //Create a shaking effect
    if (gameContainer) {
        gameContainer.classList.add('shake-animation');
        setTimeout(() => {
            gameContainer.classList.remove('shake-animation');
        }, 1800);
    }
    
    // Play a losing sound (optional)
    //playSound('lose');
}


function createConfetti(amount) {
    for (let i = 0; i < amount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Random properties for more realistic confetti
        const size = Math.random() * 10 + 10; // 5-15px
        const color = getRandomColor();
        const left = Math.random() * 100; // 0-100%
        const duration = Math.random() * 3 + 3; // 3-5s
        const delay = Math.random() * 0.5; // 0-0.5s
        
        // Set styles
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.backgroundColor = color;
        confetti.style.left = `${left}%`;
        confetti.style.animationDuration = `${duration}s`;
        confetti.style.animationDelay = `${delay}s`;
        
        document.body.appendChild(confetti);
        
        // Remove after animation completes
        setTimeout(() => {
            confetti.remove();
        }, (duration + delay) * 1000 + 500); // Add a buffer
    }
}


// Helper function to get random color for confetti
function getRandomColor() {
    const colors = [
        '#f94144', '#f3722c', '#f8961e', '#f9c74f', 
        '#90be6d', '#43aa8b', '#577590', '#277da1'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}