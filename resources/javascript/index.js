const gameState = ["", "", "", "", "", "", "", "", ""];
let tiles = document.querySelectorAll("#ttt-wrap button");
let reset = document.querySelector("#reset");
let warning = document.querySelector("#warning");
let gameOverMessage = document.querySelector("#game-over-message");
let overlay = document.querySelector("#overlay");
let playerMoves = 0;
overlay.style.display = "none";

// Listen for tile clicks
tiles.forEach((tile) => {
  tile.addEventListener("click", (event) => {
    if (event.currentTarget.textContent) {
      warning.style.display = "inline-block";
    } else {
      let tileNum = event.currentTarget.id.replace("btn", "");
      warning.style.display = "none";
      gameState[tileNum] = "X";
      playerMoves++;
      updateTiles();
      disableGame();
      if (winCheck("X")) {
        overlay.style.display = "initial";
        gameOverMessage.textContent = "Congratulations, you won!";
        gameOverMessage.style.opacity = "1";
      } else if (playerMoves > 4) {
        overlay.style.display = "initial";
        gameOverMessage.textContent = "Draw";
        gameOverMessage.style.opacity = "1";
      } else {
        // Timeout simulates computer thinking :)
        setTimeout(() => {
          computerO();
          updateTiles();
          if (winCheck("O")) {
            overlay.style.display = "initial";
            gameOverMessage.textContent = "Computer wins";
            gameOverMessage.style.opacity = "1";
          } else {
            enableGame();
          }
        }, Math.random() * 300 + 1);
      }
    }
  });
});

// Reset the board
reset.addEventListener("click", () => {
  for (let i = 0; i < gameState.length; i++) {
    gameState[i] = "";
  }
  overlay.style.display = "none";
  gameOverMessage.textContent = "";
  gameOverMessage.style.opacity = "0";
  warning.style.display = "none";
  updateTiles();
  enableGame();
  playerMoves = 0;
});

// disables all game tiles
function disableGame() {
  tiles.forEach((tile) => {
    tile.setAttribute("disabled", "disabled");
  });
}

// enables all game tiles
function enableGame() {
  tiles.forEach((tile) => {
    tile.removeAttribute("disabled");
  });
}

// Set the board according to the current condition of tttArray
function updateTiles() {
  let i = 0;
  tiles.forEach((tile) => {
    tile.textContent = gameState[i];
    i++;
  });
}

// Check if player or ai has won
function winCheck(letter) {
  if (
    isMatch3(gameState[0], gameState[1], gameState[2]) ||
    isMatch3(gameState[3], gameState[4], gameState[5]) ||
    isMatch3(gameState[6], gameState[7], gameState[8]) ||
    isMatch3(gameState[0], gameState[3], gameState[6]) ||
    isMatch3(gameState[1], gameState[4], gameState[7]) ||
    isMatch3(gameState[2], gameState[5], gameState[8]) ||
    isMatch3(gameState[0], gameState[4], gameState[8]) ||
    isMatch3(gameState[2], gameState[4], gameState[6])
  ) {
    return true;
  }
  return false;

  function isMatch3(position1, position2, position3) {
    if (position1 === letter && position2 === letter && position3 === letter) {
      return true;
    }
    return false;
  }
}

// AI
function computerO() {
  switch (playerMoves) {
    case 1:
      // Either lower right corner, or center if available
      if (gameState[4]) {
        gameState[8] = "O";
      } else {
        gameState[4] = "O";
      }
      break;
    case 2:
      // If player chose the center first, then only check edges for next move
      if (gameState[4] === "X") {
        if (gameState[0] || gameState[6]) {
          gameState[2] = "O";
        } else if (gameState[7]) {
          gameState[1] = "O";
        } else if (gameState[5]) {
          gameState[3] = "O";
        } else if (gameState[3]) {
          gameState[5] = "O";
        } else if (gameState[2]) {
          gameState[6] = "O";
        } else if (gameState[1]) {
          gameState[7] = "O";
        } else {
          alert(`gameState error (case 2 if [4])`);
        }
      } else {
        if (
          isMatch(gameState[0], gameState[1]) ||
          isMatch(gameState[5], gameState[8]) ||
          isMatch(gameState[1], gameState[7]) ||
          isMatch(gameState[3], gameState[5]) ||
          isMatch(gameState[0], gameState[5]) ||
          isMatch(gameState[1], gameState[8]) ||
          isMatch(gameState[1], gameState[5])
        ) {
          gameState[2] = "O";
        } else if (
          isMatch(gameState[0], gameState[8]) ||
          isMatch(gameState[2], gameState[6]) ||
          isMatch(gameState[2], gameState[8])
        ) {
          gameState[5] = "O";
        } else if (
          isMatch(gameState[1], gameState[2]) ||
          isMatch(gameState[3], gameState[6]) ||
          isMatch(gameState[2], gameState[3]) ||
          isMatch(gameState[1], gameState[6]) ||
          isMatch(gameState[1], gameState[3])
        ) {
          gameState[0] = "O";
        } else if (
          isMatch(gameState[2], gameState[5]) ||
          isMatch(gameState[6], gameState[7]) ||
          isMatch(gameState[2], gameState[7]) ||
          isMatch(gameState[5], gameState[6]) ||
          isMatch(gameState[5], gameState[7])
        ) {
          gameState[8] = "O";
        } else if (
          isMatch(gameState[7], gameState[8]) ||
          isMatch(gameState[0], gameState[3]) ||
          isMatch(gameState[0], gameState[7]) ||
          isMatch(gameState[3], gameState[8]) ||
          isMatch(gameState[3], gameState[7])
        ) {
          gameState[6] = "O";
        } else if (isMatch(gameState[0], gameState[2])) {
          gameState[1] = "O";
        } else if (isMatch(gameState[0], gameState[6])) {
          gameState[3] = "O";
        } else if (isMatch(gameState[6], gameState[8])) {
          gameState[7] = "O";
        } else {
          alert("gameState error (case 2 if ![4])");
        }
      }
      break;
    case 3:
    case 4: {
      let nextMoveO = readyToWin("O"),
        nextMoveX = readyToWin("X");

      if (nextMoveO < 9) {
        gameState[nextMoveO] = "O";
      } else if (nextMoveX < 9) {
        gameState[nextMoveX] = "O";
      } else if (nextMoveO + nextMoveX === 18) {
        for (let i = 0; i < gameState.length; i++) {
          if (i % 2 && playerMoves < 4) {
            i++;
          } // fix for bad move when X is on 6, 8, & 0 during player move 3
          if (!gameState[i]) {
            gameState[i] = "O";
            break;
          }
        }
      } else {
        alert(
          `gameState error (case 3) nextMoveO = ${nextMoveO}, nextMoveX = ${nextMoveX}`
        );
      }
      break;
    }
  }
  // Checks if two tiles are a matching for a given letter
  function isMatch(position1, position2, letter = "X") {
    if (position1 === letter && position2 === letter) {
      return true;
    }
    return false;
  }

  // Evaluate all positions for given letter to determine if there is a winning chance.
  // Return next suggested move, or 9 (if no winning position is found)
  // 9 is returned instead of false because false would conflict with gameState[0]
  function readyToWin(letter) {
    if (isMatch(gameState[0], gameState[1], letter) && !gameState[2]) {
      return 2;
    } else if (isMatch(gameState[0], gameState[2], letter) && !gameState[1]) {
      return 1;
    } else if (isMatch(gameState[1], gameState[2], letter) && !gameState[0]) {
      return 0;
    } else if (isMatch(gameState[3], gameState[4], letter) && !gameState[5]) {
      return 5;
    } else if (isMatch(gameState[3], gameState[5], letter) && !gameState[4]) {
      return 4;
    } else if (isMatch(gameState[4], gameState[5], letter) && !gameState[3]) {
      return 3;
    } else if (isMatch(gameState[6], gameState[7], letter) && !gameState[8]) {
      return 8;
    } else if (isMatch(gameState[6], gameState[8], letter) && !gameState[7]) {
      return 7;
    } else if (isMatch(gameState[7], gameState[8], letter) && !gameState[6]) {
      return 6;
    } else if (isMatch(gameState[0], gameState[3], letter) && !gameState[6]) {
      return 6;
    } else if (isMatch(gameState[0], gameState[6], letter) && !gameState[3]) {
      return 3;
    } else if (isMatch(gameState[3], gameState[6], letter) && !gameState[0]) {
      return 0;
    } else if (isMatch(gameState[1], gameState[4], letter) && !gameState[7]) {
      return 7;
    } else if (isMatch(gameState[1], gameState[7], letter) && !gameState[4]) {
      return 4;
    } else if (isMatch(gameState[4], gameState[7], letter) && !gameState[1]) {
      return 1;
    } else if (isMatch(gameState[2], gameState[5], letter) && !gameState[8]) {
      return 8;
    } else if (isMatch(gameState[2], gameState[8], letter) && !gameState[5]) {
      return 5;
    } else if (isMatch(gameState[5], gameState[8], letter) && !gameState[2]) {
      return 2;
    } else if (isMatch(gameState[0], gameState[4], letter) && !gameState[8]) {
      return 8;
    } else if (isMatch(gameState[0], gameState[8], letter) && !gameState[4]) {
      return 4;
    } else if (isMatch(gameState[4], gameState[8], letter) && !gameState[0]) {
      return 0;
    } else if (isMatch(gameState[2], gameState[4], letter) && !gameState[6]) {
      return 6;
    } else if (isMatch(gameState[2], gameState[6], letter) && !gameState[4]) {
      return 4;
    } else if (isMatch(gameState[4], gameState[6], letter) && !gameState[2]) {
      return 2;
    }
    return 9;
  }
}
