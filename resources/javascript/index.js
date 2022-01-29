////////// Tic-Tac-Toe //////////
// Created by: Brandon Mikowski //

// Anonymous IIFE //
(() => {
  const gameState = ["", "", "", "", "", "", "", "", ""];
  let tiles = document.querySelectorAll("#ttt-wrap button");
  let reset = document.querySelector("#reset");
  let warning = document.querySelector("#warning");
  let gameOverMessage = document.querySelector("#game-over-message");
  let overlay = document.querySelector("#overlay");
  let lineElement = document.querySelector(".win-line");
  let playerMoves = 0;
  let playerGoesFirst = true;
  let playerLetter = "X";
  let computerLetter = "O";
  let playerScore = 0,
    computerScore = 0,
    drawScore = 0;
  let playerScoreDisplay = document.querySelector("#player-score"),
    computerScoreDisplay = document.querySelector("#computer-score"),
    drawScoreDisplay = document.querySelector("#draw-score");
  overlay.style.display = "none";
  gameOverMessage.style.display = "none";

  // Listen for tile clicks
  tiles.forEach((tile) => {
    tile.addEventListener("click", (event) => {
      // Show warning if clicked box already has a letter in it
      if (event.currentTarget.textContent) {
        warning.style.display = "inline-block";
      } else {
        let tileNum = event.currentTarget.id.replace("btn", "");
        warning.style.display = "none";
        gameState[tileNum] = playerLetter;
        playerMoves++;
        updateTiles();
        disableGame();
        if (winCheck(playerLetter)) {
        } else {
          // Timeout simulates computer thinking :)
          setTimeout(() => {
            computer(computerLetter);
          }, Math.random() * 300 + 1);
        }
      }
    });
  });

  // Reset button
  reset.addEventListener("click", () => {
    for (let i = 0; i < gameState.length; i++) {
      gameState[i] = "";
    }
    lineElement.removeAttribute("id");
    overlay.style.display = "none";
    gameOverMessage.textContent = "";
    gameOverMessage.style.display = "none";
    warning.style.display = "none";
    updateTiles();
    enableGame();
    playerMoves = 0;
    playerGoesFirst = !playerGoesFirst;
    if (!playerGoesFirst) {
      computerLetter = "X";
      playerLetter = "O";
      computer(computerLetter);
    } else {
      playerLetter = "X";
      computerLetter = "O";
    }
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
      if (gameState[i] === playerLetter) {
        tile.style.color = "#1f1f1f";
      } else if (gameState[i] === computerLetter) {
        tile.style.color = "#a92c46";
      }
      tile.textContent = gameState[i];
      i++;
    });
  }

  // Check if player or ai has won - include win and draw precedures
  function winCheck(letter) {
    let lineNumber = 0;
    let winLines = [
      false,
      [gameState[0], gameState[1], gameState[2]],
      [gameState[3], gameState[4], gameState[5]],
      [gameState[6], gameState[7], gameState[8]],
      [gameState[0], gameState[3], gameState[6]],
      [gameState[1], gameState[4], gameState[7]],
      [gameState[2], gameState[5], gameState[8]],
      [gameState[0], gameState[4], gameState[8]],
      [gameState[2], gameState[4], gameState[6]],
    ];
    if (
      isMatch3(winLines[1], 1) ||
      isMatch3(winLines[2], 2) ||
      isMatch3(winLines[3], 3) ||
      isMatch3(winLines[4], 4) ||
      isMatch3(winLines[5], 5) ||
      isMatch3(winLines[6], 6) ||
      isMatch3(winLines[7], 7) ||
      isMatch3(winLines[8], 8)
    ) {
      lineElement.setAttribute("id", `line-${lineNumber}`);
      if (letter === playerLetter) {
        lineElement.style.backgroundColor = "#a92c46";
        overlay.style.display = "initial";
        gameOverMessage.textContent = "Congratulations, you won!";
        gameOverMessage.style.display = "intial";
        playerScore++;
        playerScoreDisplay.textContent = playerScore;
      } else {
        lineElement.style.backgroundColor = "black";
        overlay.style.display = "initial";
        gameOverMessage.textContent = "Computer wins";
        gameOverMessage.style.display = "initial";
        computerScore++;
        computerScoreDisplay.textContent = computerScore;
      }
      return true;
    } else if (gameState.filter((value) => value === "X").length > 4) {
      overlay.style.display = "initial";
      gameOverMessage.textContent = "Draw";
      gameOverMessage.style.display = "initial";
      drawScore++;
      drawScoreDisplay.textContent = drawScore;
      return true;
    }
    return false;

    function isMatch3(positions, line) {
      if (
        positions[0] === letter &&
        positions[1] === letter &&
        positions[2] === letter
      ) {
        lineNumber = line;
        return true;
      }
      return false;
    }
  }

  // AI
  function computer(letter) {
    switch (playerMoves) {
      case 0:
        gameState[4] = letter;
        break;
      case 1:
        // Either random corner, or center if available
        if (!gameState[4]) {
          gameState[4] = letter;
        } else {
          switch (randomNumber(1, 4)) {
            case 1:
              if (!gameState[0]) {
                gameState[0] = letter;
                break;
              }
            case 2:
              if (!gameState[2]) {
                gameState[2] = letter;
                break;
              }
            case 3:
              if (!gameState[6]) {
                gameState[6] = letter;
                break;
              }
            case 4:
              if (!gameState[8]) {
                gameState[8] = letter;
                break;
              }
            default:
              for (let i = 0; i < gameState.length; i++) {
                if (!gameState[i]) {
                  gameState[i] = letter;
                  break;
                }
              }
          }
        }
        break;
      case 2:
        if (gameState[4] === "X") {
          let nextMoveX = readyToWin("X");
          let nextMoveO = readyToWin("O");
          if (nextMoveX < 9) {
            gameState[nextMoveX] = letter;
          } else if (nextMoveO < 9) {
            gameState[nextMoveO] = letter;
          }
          // When player goes second and choses a side instead of a corner
          //  they should always lose
          else if (
            !playerGoesFirst &&
            !gameState[3] &&
            !gameState[6] &&
            !gameState[7]
          ) {
            gameState[6] = computerLetter;
          } else if (
            !playerGoesFirst &&
            !gameState[0] &&
            !gameState[1] &&
            !gameState[3]
          ) {
            gameState[0] = computerLetter;
          } else if (
            !playerGoesFirst &&
            !gameState[1] &&
            !gameState[2] &&
            !gameState[5]
          ) {
            gameState[2] = computerLetter;
          } else if (
            !playerGoesFirst &&
            !gameState[5] &&
            !gameState[7] &&
            !gameState[8]
          ) {
            gameState[8] = computerLetter;
          } else {
            let randomCorner = randomNumber(1, 4) * 2;
            // to make randomCorner 0, 2, 6, or 8
            if (randomCorner === 4) {
              randomCorner = 0;
            }
            if (!gameState[randomCorner]) {
              gameState[randomCorner] = letter;
            } else {
              // if RandomCorner isn't a valid spot, then just iterate through all corners until empty spot is found
              for (let i = 0; i < gameState.length; i += 2) {
                if (i === 4) {
                  i = 6;
                }
                if (!gameState[i]) {
                  gameState[i] = letter;
                  break;
                }
              }
            }
          }
        } else {
          if (
            isMatch(gameState[0], gameState[1], playerLetter) ||
            isMatch(gameState[5], gameState[8], playerLetter) ||
            isMatch(gameState[1], gameState[7], playerLetter) ||
            isMatch(gameState[3], gameState[5], playerLetter) ||
            isMatch(gameState[0], gameState[5], playerLetter) ||
            isMatch(gameState[1], gameState[8], playerLetter) ||
            isMatch(gameState[1], gameState[5], playerLetter)
          ) {
            gameState[2] = letter;
          } else if (
            isMatch(gameState[0], gameState[8], playerLetter) ||
            isMatch(gameState[2], gameState[6], playerLetter) ||
            isMatch(gameState[2], gameState[8], playerLetter)
          ) {
            gameState[5] = letter;
          } else if (
            isMatch(gameState[1], gameState[2], playerLetter) ||
            isMatch(gameState[3], gameState[6], playerLetter) ||
            isMatch(gameState[2], gameState[3], playerLetter) ||
            isMatch(gameState[1], gameState[6], playerLetter) ||
            isMatch(gameState[1], gameState[3], playerLetter)
          ) {
            gameState[0] = letter;
          } else if (
            isMatch(gameState[2], gameState[5], playerLetter) ||
            isMatch(gameState[6], gameState[7], playerLetter) ||
            isMatch(gameState[2], gameState[7], playerLetter) ||
            isMatch(gameState[5], gameState[6], playerLetter) ||
            isMatch(gameState[5], gameState[7], playerLetter)
          ) {
            gameState[8] = letter;
          } else if (
            isMatch(gameState[7], gameState[8], playerLetter) ||
            isMatch(gameState[0], gameState[3], playerLetter) ||
            isMatch(gameState[0], gameState[7], playerLetter) ||
            isMatch(gameState[3], gameState[8], playerLetter) ||
            isMatch(gameState[3], gameState[7], playerLetter)
          ) {
            gameState[6] = letter;
          } else if (isMatch(gameState[0], gameState[2], playerLetter)) {
            gameState[1] = letter;
          } else if (isMatch(gameState[0], gameState[6], playerLetter)) {
            gameState[3] = letter;
          } else if (isMatch(gameState[6], gameState[8], playerLetter)) {
            gameState[7] = letter;
          } else {
            alert("gameState error (case 2 if ![4])");
          }
        }
        break;
      case 3:
      case 4: {
        let nextMoveO = readyToWin(letter),
          nextMoveX = readyToWin(playerLetter);

        if (nextMoveO < 9) {
          gameState[nextMoveO] = letter;
        } else if (nextMoveX < 9) {
          gameState[nextMoveX] = letter;
        } else if (nextMoveO + nextMoveX === 18) {
          for (let i = 0; i < gameState.length; i++) {
            // Fix for specific cases: X| |     | |X    |X|
            //                          |O|X   X|O|O    |O|
            //                          |X|O    | |X   X|O|X
            if (
              (isMatch(gameState[5], gameState[7], playerLetter) &&
                gameState[0] === playerLetter &&
                i === 1) ||
              (isMatch(gameState[2], gameState[8], playerLetter) &&
                gameState[3] === playerLetter &&
                i === 0) ||
              (isMatch(gameState[6], gameState[8], playerLetter) &&
                gameState[1] === playerLetter &&
                (i === 0 || i === 2))
            ) {
              if (playerMoves < 4) {
                i++;
              }
            }
            // Place O on first empty tile found
            if (!gameState[i]) {
              gameState[i] = letter;
              break;
            }
          }
        } else {
          alert(
            `gameState error (case 4) nextMoveO = ${nextMoveO}, nextMoveX = ${nextMoveX}`
          );
        }
        break;
      }
    }

    updateTiles();
    if (winCheck(computerLetter)) {
    } else {
      enableGame();
    }

    // Checks if two tiles are a matching for a given letter
    function isMatch(position1, position2, currentLetter = "") {
      if (currentLetter === "") {
        alert("isMatch error: currentLetter not defined");
      } else if (position1 === currentLetter && position2 === currentLetter) {
        return true;
      }
      return false;
    }

    // Evaluate all positions for given letter to determine if there is a winning chance.
    // Return next suggested move, or 9 (if no winning position is found)
    // 9 is returned instead of false because false would conflict with gameState[0]
    function readyToWin(currentLetter) {
      if (isMatch(gameState[0], gameState[1], currentLetter) && !gameState[2]) {
        return 2;
      } else if (
        isMatch(gameState[0], gameState[2], currentLetter) &&
        !gameState[1]
      ) {
        return 1;
      } else if (
        isMatch(gameState[1], gameState[2], currentLetter) &&
        !gameState[0]
      ) {
        return 0;
      } else if (
        isMatch(gameState[3], gameState[4], currentLetter) &&
        !gameState[5]
      ) {
        return 5;
      } else if (
        isMatch(gameState[3], gameState[5], currentLetter) &&
        !gameState[4]
      ) {
        return 4;
      } else if (
        isMatch(gameState[4], gameState[5], currentLetter) &&
        !gameState[3]
      ) {
        return 3;
      } else if (
        isMatch(gameState[6], gameState[7], currentLetter) &&
        !gameState[8]
      ) {
        return 8;
      } else if (
        isMatch(gameState[6], gameState[8], currentLetter) &&
        !gameState[7]
      ) {
        return 7;
      } else if (
        isMatch(gameState[7], gameState[8], currentLetter) &&
        !gameState[6]
      ) {
        return 6;
      } else if (
        isMatch(gameState[0], gameState[3], currentLetter) &&
        !gameState[6]
      ) {
        return 6;
      } else if (
        isMatch(gameState[0], gameState[6], currentLetter) &&
        !gameState[3]
      ) {
        return 3;
      } else if (
        isMatch(gameState[3], gameState[6], currentLetter) &&
        !gameState[0]
      ) {
        return 0;
      } else if (
        isMatch(gameState[1], gameState[4], currentLetter) &&
        !gameState[7]
      ) {
        return 7;
      } else if (
        isMatch(gameState[1], gameState[7], currentLetter) &&
        !gameState[4]
      ) {
        return 4;
      } else if (
        isMatch(gameState[4], gameState[7], currentLetter) &&
        !gameState[1]
      ) {
        return 1;
      } else if (
        isMatch(gameState[2], gameState[5], currentLetter) &&
        !gameState[8]
      ) {
        return 8;
      } else if (
        isMatch(gameState[2], gameState[8], currentLetter) &&
        !gameState[5]
      ) {
        return 5;
      } else if (
        isMatch(gameState[5], gameState[8], currentLetter) &&
        !gameState[2]
      ) {
        return 2;
      } else if (
        isMatch(gameState[0], gameState[4], currentLetter) &&
        !gameState[8]
      ) {
        return 8;
      } else if (
        isMatch(gameState[0], gameState[8], currentLetter) &&
        !gameState[4]
      ) {
        return 4;
      } else if (
        isMatch(gameState[4], gameState[8], currentLetter) &&
        !gameState[0]
      ) {
        return 0;
      } else if (
        isMatch(gameState[2], gameState[4], currentLetter) &&
        !gameState[6]
      ) {
        return 6;
      } else if (
        isMatch(gameState[2], gameState[6], currentLetter) &&
        !gameState[4]
      ) {
        return 4;
      } else if (
        isMatch(gameState[4], gameState[6], currentLetter) &&
        !gameState[2]
      ) {
        return 2;
      }
      return 9;
    }
  }

  // Random number generator (min and max are both inclusive)
  function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
})();
