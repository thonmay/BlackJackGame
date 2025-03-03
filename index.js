//Game State Variables
let deck = [];
let playerCards = [];
let dealerCards = [];
let playerSum = 0;
let dealerSum = 0;
let hasBlackJack = false;
let isAlive = true;
let message = "";

//Card Suits & Values
const SUITS = ["Hearts", "Diamonds", "Clubs", "Spades"];
const VALUES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"];


//Elements
const msgEl = document.getElementById("msgEl");
const playersCardEl = document.getElementById("playersCardEl");
const dealersCardEl = document.getElementById("dealersCardEl");
const playerSumEl = document.getElementById("playerSumEl");
const dealerSumEl = document.getElementById("dealerSumEl");
const gameContainer = document.getElementById("game-container");
const startBtn = document.getElementById("start-btn");
const newCardBtn = document.getElementById("new-card-btn");
const standBtn = document.getElementById("stand-btn");
const h2El = document.querySelectorAll("h2");


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
    dealerCards = [getRandomCard(), getRandomCard()];
    playerCards = [getRandomCard(), getRandomCard()];
    renderGame();
    startBtn.style.visibility = 'hidden';
}

function resetGame()
{
    playersCardEl.innerHTML = "";
    dealersCardEl.innerHTML = "";
    startBtn.style.visibility = 'visible';
    playerSumEl.textContent = "";
    dealerSumEl.textContent = "";
    h2El[0].textContent =  "";
    h2El[1].textContent = "";
    standBtn.style.visibility = 'hidden';
    newCardBtn.style.visibility = 'hidden';
    msgEl.textContent = "Another Round?";
}


function renderGame() {

    playersCardEl.innerHTML = "";
    dealersCardEl.innerHTML = "";
    // Display each card as an image
    dealerCards.forEach(card => {
        const cardImage = renderCardImage(card);
        dealersCardEl.appendChild(cardImage);
    });
    playerCards.forEach(card => {
        const cardImage = renderCardImage(card);
        playersCardEl.appendChild(cardImage);
    });
    
    playerSum = playerCards.reduce( (total, card) => total + (["Jack", "Queen", "King", "Ace"].includes(card.value) ? 10 : card.value), 0);
    dealerSum = dealerCards.reduce( (total, card) => total + (["Jack", "Queen", "King", "Ace"].includes(card.value) ? 10 : card.value), 0);

    if(playerSum <= 20 && dealerSum <= 20) {
        message = "Do you want to draw a new card?🙂 ";
    } else if (playerSum === 21) {
        message = "You've got Blackjack!🤩";
        hasBlackJack = true;
        isAlive = false;
        celebrateWin();
        setTimeout(resetGame, 1500);
        //resetGame();
    } else if( dealerSum > 21) {
        message = "Dealer Busts! You Win!😎";
        isAlive = false;
        celebrateWin();
        setTimeout(resetGame, 1500)
    } else if(dealerSum === 21)
    {
        message = "Dealer has Blackjack! You Lose!😒";
        isAlive = false;
        showFailure();
        setTimeout(resetGame, 1000);
    }
     else {
        message = "BUST!!! You Lose!😒";
        isAlive = false;
        showFailure();
        setTimeout(resetGame, 1000);
    }
    dealerSumEl.textContent = "Sum: " + dealerSum;
    playerSumEl.textContent = "Sum: " + playerSum;
    msgEl.textContent = message;
    h2El[0].textContent =  "Dealer Cards";
    h2El[1].textContent = "Your Cards";
    standBtn.style.visibility = 'visible';
    newCardBtn.style.visibility = 'visible';
}


standBtn.addEventListener("click", addDealerCard);

function addDealerCard() {
    if (isAlive && !hasBlackJack) {
        let newCard = getRandomCard();
        dealerCards.push(newCard);
        dealerSum += newCard;
        renderGame();
    } 
}
function newCard()
{
    // Only allow drawing a card if the game is still active
    if (isAlive && !hasBlackJack) {
        let newCard = getRandomCard();
        playerCards.push(newCard);
        playerSum += newCard;
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

    //Hide all the buttons
    startBtn.style.visibility = 'hidden';
    newCardBtn.style.visibility = 'hidden';
    standBtn.style.visibility = 'hidden';
    
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