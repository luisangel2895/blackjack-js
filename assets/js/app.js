// 2C -> two of clubs
// 2D -> two of diamonds
// 2H -> two of hearts
// 2S -> two of spades

// MODULE PATTERN
// the way hwo to encapsulate the code is putting the code into a anonimal function
// that is invoked itself, becasuse this function have its own scope
const myModule = (() => {
  // use strict is like a inter linter of js to help us to be a good code
  "use strict";

  let deck = [];
  const types = ["C", "D", "H", "S"],
    specials = ["A", "J", "K", "Q"];
  let pointsPlayers = [];
  // with query selector only receive 1 element, but with queryselectorall received all
  const btnGive = document.querySelector(".btnGive"),
    btnStop = document.querySelector(".btnStop"),
    btnNew = document.querySelector(".btnNew");
  const pointsHTML = document.querySelectorAll("small"),
    cardsPlayerHTML = document.querySelectorAll(".cards-player");

  // Start the game
  const startGame = (numPlayers = 2) => {
    deck = createDeck();
    pointsPlayers = [];
    for (let index = 0; index < numPlayers; index++) {
      pointsPlayers.push(0);
    }
    pointsHTML.forEach((elem) => (elem.innerHTML = 0));
    cardsPlayerHTML.forEach((elem) => (elem.innerHTML = ""));
    btnGive.disabled = false;
    btnStop.disabled = false;
  };

  // Function to create and suffle a deck
  const createDeck = () => {
    deck = [];
    for (let i = 2; i <= 10; i++) {
      for (const type of types) {
        deck.push(i + type);
      }
    }
    for (const type of types) {
      for (const esp of specials) {
        deck.push(esp + type);
      }
    }
    // Now to randomize the order of the array we use library undersocre
    return _.shuffle(deck);
  };

  // Funtion to give a card
  const giveCard = () => {
    if (deck.length === 0) {
      throw "No card in the deck";
    }
    return deck.pop();
  };

  // Function to get the value of the card
  const valueCard = (card) => {
    const value = card.substring(0, card.length - 1);
    // in blackjack A = 11 and the other special cards 10
    return isNaN(value) ? (value === "A" ? 11 : 10) : Number(value);
  };

  // Turn 0 : first player, Last turn: computer
  const amassPointsPlayer = (card, turn) => {
    pointsPlayers[turn] += valueCard(card);
    pointsHTML[turn].innerText = pointsPlayers[turn];
    return pointsPlayers[turn];
  };

  // Create cards
  const createCard = (card, turn) => {
    const newCardHTML = document.createElement("img");
    newCardHTML.src = `assets/cards/${card}.png`;
    newCardHTML.classList.add("img-card");
    cardsPlayerHTML[turn].append(newCardHTML);
  };

  // Show winner
  const showWinner = () => {
    const [minimumPoints, pointsComputer] = pointsPlayers;
    setTimeout(() => {
      if (pointsComputer === minimumPoints) {
        alert("Noone win :/");
      } else if (minimumPoints > 21) {
        alert("Computer Win :(");
      } else if (pointsComputer > 21) {
        alert("Player Win :)");
      } else if (minimumPoints === 21) {
        alert("Player Win :)");
      } else {
        alert("Computer Win :(");
      }
    }, 10);
  };

  // Turn of computer
  const turnComputer = (minimumPoints) => {
    let pointsComputer = 0;
    do {
      const card = giveCard();
      pointsComputer = amassPointsPlayer(card, pointsPlayers.length - 1);
      createCard(card, pointsPlayers.length - 1);
      if (minimumPoints > 21) {
        break;
      }
    } while (pointsComputer < minimumPoints && minimumPoints <= 21);
    showWinner();
  };

  // btnGive
  btnGive.addEventListener("click", () => {
    const card = giveCard();
    const pointsPlayer = amassPointsPlayer(card, 0);
    createCard(card, 0);

    if (pointsPlayer > 21) {
      btnGive.disabled = true;
      btnStop.disabled = true;
      turnComputer(pointsPlayer);
    } else if (pointsPlayer === 21) {
      btnGive.disabled = false;
      btnStop.disabled = true;
      turnComputer(pointsPlayer);
    }
  });

  // btnStop
  btnStop.addEventListener("click", () => {
    btnGive.disabled = true;
    btnStop.disabled = true;
    turnComputer(pointsPlayers[0]);
  });

  // btnNew
  btnNew.addEventListener("click", () => {
    console.clear();
    startGame();
  });

  // the modules always need to return , and the think that we return is the only
  // public out of this module
  // in this case we export the function startGame as newGameOutside
  return {
    newGameOutside: startGame,
  };
})();
