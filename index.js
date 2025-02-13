let player = {
  name: "Player",
  chips: 200,
  cards: [],
  sum: 0,
};

let dealer = {
  name: "Dealer",
  chips: 200,
  cards: [],
  sum: 0,
};

//let name = prompt("Enter your name: ");
if (!name) {
  name = "Player";
}
let playername = document.getElementById("player-name");
playername.textContent = name;

let win = 0;
let sum = 0;
let pot = 25;
let hasBlackJack = false;
let isAlive = false;
let dealersTurn = false;
let message = "";
let messageEl = document.getElementById("message-el");
let sumEl = document.getElementById("sum-el");
let cardsEl = document.getElementById("cards-el");
let playerEl = document.getElementById("player-el");
let dealerSumEl = document.getElementById("sum-el-dealer");
let dealerCardsEl = document.getElementById("cards-el-dealer");
let dealerEl = document.getElementById("dealer-el");
let hitbutton = document.getElementById("hit");
let standbutton = document.getElementById("stand");
let startbutton = document.getElementById("start");
let dealerSquare = document.getElementById("dealer-square");
let playerSquare = document.getElementById("player-square");
dealerSquare.style.visibility = "hidden";
playerSquare.style.visibility = "hidden";

toggleButton(hitbutton, false);
toggleButton(standbutton, false);
toggleButton(startbutton, true);

playerEl.textContent = "$" + player.chips;
dealerEl.textContent = "$" + dealer.chips;

function endturn() {
  toggleButton(hitbutton, false);
  toggleButton(standbutton, false);
  playerSquare.style.visibility = "hidden";
  dealerSquare.style.visibility = "visible";

  dealersTurn = true;
  dealer.cards.push(getRandomCard());
  dealer.cards.push(getRandomCard());
  dealer.sum = dealer.cards[0] + dealer.cards[1];

  function revealDealerCards() {
    if (dealer.sum < 17) {
      setTimeout(() => {
        let newCard = getRandomCard();
        dealer.cards.push(newCard);
        dealer.sum += newCard;

        dealerCardsEl.textContent = "Cards: ";
        for (let j = 0; j < dealer.cards.length; j++) {
          dealerCardsEl.textContent += dealer.cards[j] + " ";
        }
        dealerSumEl.textContent = "Sum: " + dealer.sum;

        // Check if we should draw another card
        if (dealer.sum < 17) {
          revealDealerCards(); // Recursive call for the next card
        } else {
          renderGame(); // Render game after all dealer cards are drawn
        }
      }, 2000); // 2-second delay
    } else {
      renderGame(); // Render game if dealer already has >= 17
    }
  }

  // Display the first two cards immediately
  dealerCardsEl.textContent = "Cards: ";
  for (let j = 0; j < dealer.cards.length; j++) {
    dealerCardsEl.textContent += dealer.cards[j] + " ";
  }
  dealerSumEl.textContent = "Sum: " + dealer.sum;

  // Start revealing additional cards with a delay
  revealDealerCards();
}

function getRandomCard() {
  let randomNumber = Math.floor(Math.random() * 13) + 1;
  if (randomNumber > 10) {
    return 10;
  } else if (randomNumber === 1) {
    return 11;
  } else {
    return randomNumber;
  }
}

function startGame() {
  toggleButton(hitbutton, true);
  toggleButton(standbutton, true);
  toggleButton(startbutton, false);
  playerSquare.style.visibility = "visible";
  dealerSquare.style.visibility = "hidden";

  dealer.cards = [];
  dealer.sum = 0;
  dealersTurn = false;
  dealerCardsEl.textContent =
    "Cards: " + (dealer.cards[0] ?? "") + " " + (dealer.cards[1] ?? "");
  dealerSumEl.textContent = "Sum: " + dealer.sum;

  isAlive = true;
  let firstCard = getRandomCard();
  let secondCard = getRandomCard();
  player.cards = [firstCard, secondCard];
  player.sum = firstCard + secondCard;
  renderGame();
}

function renderGame() {
  cardsEl.textContent = "Cards: ";
  for (let i = 0; i < player.cards.length; i++) {
    cardsEl.textContent += player.cards[i] + " ";
  }

  sumEl.textContent = "Sum: " + player.sum;
  if (player.sum <= 20) {
    message = "Do you want to draw a new card?";
  } else if (player.sum === 21) {
    message = "You've got Blackjack!";
    hasBlackJack = true;
  } else {
    message = "You're out of the game!";
    isAlive = false;
    endgame();
  }

  if (dealersTurn && player.sum <= 21) {
    if (dealer.sum > 21) {
      message = "Dealer busted! You win!";
    } else if (dealer.sum > player.sum) {
      message = "Dealer wins!";
    } else if (dealer.sum < player.sum) {
      message = "You win!";
    } else {
      message = "It's a tie!";
    }
  }
  messageEl.textContent = message;

  if (dealersTurn) {
    endgame();
  }
}

function newCard() {
  if (isAlive === true && hasBlackJack === false) {
    let card = getRandomCard();
    player.sum += card;
    player.cards.push(card);
    renderGame();
  }
}

function endgame() {
  toggleButton(startbutton, true);
  toggleButton(hitbutton, false);
  toggleButton(standbutton, false);
  if (player.sum > 21) {
    message = "You're out of the game!";
    player.chips -= pot;
    dealer.chips += pot;
  } else if (dealer.sum > 21) {
    message = "Dealer busted! You win!";
    player.chips += pot;
    dealer.chips -= pot;
  } else if (player.sum > dealer.sum) {
    message = "You win!";
    player.chips += pot;
    dealer.chips -= pot;
  } else if (player.sum < dealer.sum) {
    message = "Dealer wins!";
    player.chips -= pot;
    dealer.chips += pot;
  } else if (player.sum === dealer.sum) {
    message = "It's a tie!";
  }

  playerEl.textContent = "$" + player.chips;
  dealerEl.textContent = "$" + dealer.chips;

  if (player.chips <= 0) {
    message = "You've run out of chips! Game over!";
  }
  messageEl.textContent = message;
  hasBlackJack = false;
}

//enabling and disabeling buttons
function toggleButton(button, enable) {
  if (enable) {
    button.disabled = false;
    button.style.opacity = "1";
    button.style.cursor = "pointer";
  } else {
    button.disabled = true;
    button.style.opacity = "0.5";
    button.style.cursor = "default";
  }
}
