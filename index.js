//Game State Variables
let deck = [];
let playerCards = [];
let sum = 0;
let hasBlackJack = false;
let isAlive = true;
let message = "";

//Card Suits & Values
const SUITS = ["Hearts", "Diamonds", "Clubs", "Spades"];
const VALUES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"];


//Elements
const msgEl = document.getElementById("msgEl");
const cardEl = document.getElementById("cardEl");
const sumEl = document.getElementById("sumEl");
const gameContainer = document.getElementById("game-container");
const startBtn = document.getElementById("start-btn");

//Initial Message
msgEl.textContent = "Wanna play a game of Black Jack?";
startBtn.style.visibility = 'visible';

//Creating Deck
function createDeck() {
    //Iterating over suits and values
    let newDeck = [];
    for(let suit of SUITS)
    {
        for(let value of VALUES)
        {
            //Creating a Card Object & Inserting it into the Deck
            const card = {
                suit: suit,
                value: (["Jack", "Queen", "King", "Ace"].includes(value)) ? value : 
                parseInt(value) //The value of the card, assuming Ace to be 10 for now
            }
            newDeck.push(card);
        }
        return newDeck;
    }
}

//Shuffle Deck
function shuffleDeck(deck) {
    //Using Fisher-Yates Algorithm
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]]; // Swap elements
    }
    return deck;
}


//Get Random Card
function getRandomCard() {
    if(deck.length < 10)
        deck = shuffleDeck(createDeck());
    return deck.pop();
}


function startGame()
{
    resetGame();
    isAlive = true;
    hasBlackJack = false;
    deck = shuffleDeck(createDeck());
    playerCards = [getRandomCard(), getRandomCard()];
    console.log(playerCards);
    renderGame();
    startBtn.style.visibility = 'hidden';
    sumEl.innerHTML = "";
}

function resetGame()
{
    cards = [];
    cardEl.innerHTML = "";
    startBtn.style.visibility = 'visible';
}


function renderGame() {

    cardEl.innerHTML = "";
    // Display each card as an image
    playerCards.forEach(card => {
        const cardImage = renderCardImage(card);
        cardEl.appendChild(cardImage);
    });
    
    sum = playerCards.reduce( (total, card) => total + (["Jack", "Queen", "King", "Ace"].includes(card.value) ? 10 : card.value), 0);
    console.log(playerCards.join(", "));
    if(sum <= 20) {
        message = "Do you want to draw a new card?🙂 ";
    } else if (sum === 21) {
        message = "You've got Blackjack!🤩";
        hasBlackJack = true;
        isAlive = false;
        celebrateWin();
        setTimeout(resetGame, 3000);
        //resetGame();
    } else {
        message = "BUST!!! You're out of the game!😒";
        isAlive = false;
        showFailure();
        setTimeout(resetGame, 2000);
        //resetGame();
    }
    //cardEl.textContent = "Cards: " + cards.join(" ");
    sumEl.textContent = "Sum: " + sum;
    msgEl.textContent = message;
}

function newCard()
{
    // Only allow drawing a card if the game is still active
    if (isAlive && !hasBlackJack) {
        let newCard = getRandomCard();
        playerCards.push(newCard);
        sum += newCard;
        renderGame();
    }
}

// Render card image
function renderCardImage(card) {
    const cardImg = document.createElement('img');
    
    let cardName;
    if (typeof (card.value) === 'string') {
        cardName = card.value.toLowerCase() + '_of_' + card.suit.toLowerCase();
    } else {
        cardName = card.value + '_of_' + card.suit.toLowerCase();
    }
    
    cardImg.src = `images/${cardName}.png`;
    cardImg.alt = `${card.value} of ${card.suit}`;
    cardImg.className = 'card-img';
    
    return cardImg;
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