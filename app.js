'use strict';

const playerOne = 1;
const playerTwo = 2;
const playerOneColour = '#FF0000';
const playerTwoColour = '#FFFF00';
let currentPlayer = playerOne;
let currentPlayerColour = playerOneColour;

let boardRows = 6;
let boardCols = 7;
let boardSqrWidth = 100;
let boardCirclesR = 35;

let boardCanvas = document.getElementById('board');
let boardCtx = boardCanvas.getContext('2d');
boardCanvas.setAttribute('width', boardSqrWidth * boardCols);
boardCanvas.setAttribute('height', boardSqrWidth * boardRows);

// Add click listener
boardCanvas.addEventListener('click', (evt) => {
  let mouseX = evt.clientX - boardCanvas.getBoundingClientRect().left;
  let col = 0

  // Determine column click was inspect
  for (let i = 1; i <= boardCols; i++) {
    if (mouseX < boardSqrWidth * i) {
      col = i - 1;
      break;
    }
  }

  if (!isLegalMove(col)) {
    alert("Can't drop a counter there. Choose another column.");
    return;
  }

  let counterPos = dropCounter(currentPlayer, col);
  let x = counterPos % boardCols;
  let y = Math.floor(counterPos / boardCols);
  drawCounter(x, y, currentPlayerColour);

  let counters = hasWon(currentPlayer, counterPos)
  if (counters) {
    alert("Game Over!\nPlayer " + currentPlayer + " wins");
  }

  if (currentPlayer == playerOne) {
    currentPlayer = playerTwo;
    currentPlayerColour = playerTwoColour;
  } else {
    currentPlayer = playerOne;
    currentPlayerColour = playerOneColour;
  }

}, false)


// Draw board
boardCtx.fillStyle = '#0000FF';
boardCtx.beginPath();
boardCtx.moveTo(0, 0);
boardCtx.lineTo(boardCtx.canvas.width, 0);
boardCtx.lineTo(boardCtx.canvas.width, boardCtx.canvas.height);
boardCtx.lineTo(0, boardCtx.canvas.height);
// Cut out circles
for (let i = 0; i < boardRows; i++) {
  for (let j = 0; j < boardCols; j++) {
    boardCtx.moveTo(boardSqrWidth * (j + 0.5), boardSqrWidth * (i * 0.5));
    boardCtx.arc(boardSqrWidth * (j + 0.5), boardSqrWidth * (i + 0.5),
      boardCirclesR, 0, Math.PI*2, true);
  }
}
boardCtx.closePath();
boardCtx.fill();

let board = []
board.length = boardCols * boardRows;
board.fill(0);

// Draw counter at given board coords
function drawCounter (x, y, colour) {
  let posX = boardSqrWidth * (x + 0.5);
  let posY = boardSqrWidth * (y + 0.5);
  boardCtx.beginPath();
  boardCtx.moveTo(posX, posY);
  boardCtx.arc(posX, posY, boardCirclesR, 0, Math.PI*2, true);
  boardCtx.closePath();
  boardCtx.fillStyle = colour;
  boardCtx.fill();
}

// Check if column chosen by player is full
function isLegalMove(col) {
  return (board[col % boardCols] == 0) ? true : false;
}

// Drops counter in column if space available
function dropCounter(player, col) {
  for (let i = boardRows - 1; i >= 0; i--) {
    let pos = boardCols * i + col;
    if (board[pos] == 0) {
      board[pos] = player;
      return pos;
    }
  }
}

// Checks if player has won
function hasWon(player, currentPos) {
  let counterX = currentPos % boardCols;
  let counterY = Math.floor(currentPos / boardCols);
  let counters = [];

  // Check for horizontal win
  for (let pos = boardCols * counterY; pos < boardCols * (counterY + 1); pos++) {
    if (board[pos] != player) {
      counters = [];
    } else if (counters.push(pos) == 4) {
      return counters;
    }
  }

  // Check for vertical win
  counters = []
  for (let pos = counterX; pos <= board.length; pos += boardCols) {
    if (board[pos] != player) {
      counters = [];
    } else {
      counters.push(pos)
      if (counters.length == 4) {
        return counters;
      }
    }
  }

  // Check for diagonal win (SE direction)
  let posDiff = boardCols + 1;
  let startPos = currentPos - Math.min(counterX, counterY) * posDiff;
  let endPos = currentPos + Math.min(boardCols - counterX - 1,
    boardRows - counterY - 1) * posDiff;
  for (let pos = startPos; pos <= endPos; pos += posDiff) {
    if (board[pos] != player) {
      counters = [];
    } else if (counters.push(pos) == 4) {
      return counters;
    }
  }

  // Check for diagonal win (NE direction)
  posDiff = 6
  startPos = currentPos + Math.min(counterX, boardRows - counterY - 1) * posDiff;
  endPos = currentPos - Math.min(boardCols - counterX - 1, counterY) * posDiff;
  counters = [];
  for (let pos = startPos; pos >= endPos; pos -= posDiff) {
    if (board[pos] != player) {
      counters = [];
    } else if (counters.push(pos) == 4) {
      return counters;
    }
  }
  return false;
}
