var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var grid = 16;
var count = 0;
var score = 0;
var max = 0;

var snake = {
  x: 160,
  y: 160,

  // snake velocity. moves one grid length every frame in either the x or y direction
  dx: grid,
  dy: 0,

  // keep track of all grids the snake body occupies
  cells: [],

  // length of the snake. grows when eating an apple
  maxCells: 4
};
var apple = {
  x: 320,
  y: 320
};


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


function ResetGame() {
  snake.x = 160;
  snake.y = 160;
  snake.cells = [];
  snake.maxCells = 4;
  snake.dx = grid;
  snake.dy = 0;
  apple.x = getRandomInt(0, 25) * grid;
  apple.y = getRandomInt(0, 25) * grid;
  score = 0;
  document.getElementById('score').innerHTML = score;

}

function GameOver() {

  SetHighScore();
  ResetGame();
}
async function SetHighScore() {

  let newhs = await FetchHighScore(score);
  console.log("newsh:" + newhs);
  if (newhs > max) {
    max = newhs;
  }

  if (score > max) {
    max = score;
  }
  document.getElementById('high').innerHTML = max;
}
async function FetchHighScore(sc) {
  try {
    let reqString = "http://127.0.0.1:5000/sethighscore/" + score
    let response = await fetch(reqString);
    let responseText = await response.text();
    console.log("responseText:" + responseText);
    return responseText;

  } catch (e) {
    console.log("ERROR:" + sc);

    return sc;

  }
  //let reqString="http://127.0.0.1:5000/sethighscore/" + score
  //let response = await fetch(reqString);
  //let responseText = await response.text();
  //console.log("responseText:" + responseText);
  //return responseText;
}

// game loop
function loop() {
  requestAnimationFrame(loop);
  // slow game loop to 15 fps instead of 60 (60/15 = 4)
  if (++count < 4) {
    return;
  }
  count = 0;
  context.clearRect(0, 0, canvas.width, canvas.height);
  // move snake by it's velocity
  snake.x += snake.dx;
  snake.y += snake.dy;
  if (snake.x < 0) {
    GameOver();
  }
  else if (snake.x >= canvas.width) {
    GameOver();
  }

  if (snake.y < 0) {
    GameOver();
  }
  else if (snake.y >= canvas.height) {
    GameOver();
  }
  // keep track of where snake has been. front of the array is always the head
  snake.cells.unshift({ x: snake.x, y: snake.y });
  // remove cells as we move away from them
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }
  // draw apple
  context.fillStyle = '#4dacf1';
  context.fillRect(apple.x, apple.y, grid - 1, grid - 1);
  // draw snake one cell at a time
  context.fillStyle = '#b15afe';
  snake.cells.forEach(function (cell, index) {

    // drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
    context.fillRect(cell.x, cell.y, grid - 1, grid - 1);
    // snake ate apple
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      score += 10;
      //max=score;
      document.getElementById('score').innerHTML = score;

      // canvas is 400x400 which is 25x25 grids 
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }
    // check collision with all cells after this one (modified bubble sort)
    for (var i = index + 1; i < snake.cells.length; i++) {

      // snake occupies same space as a body part. reset game
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        GameOver();
      }
    }
  }

  );

}
// listen to keyboard events to move the snake
document.addEventListener('keydown', function (e) {
  // prevent snake from backtracking on itself by checking that it's 
  // not already moving on the same axis (pressing left while moving
  // left won't do anything, and pressing right while moving left
  // shouldn't let you collide with your own body)

  // left arrow key
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  // up arrow key
  else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  // right arrow key
  else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  // down arrow key
  else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});
// start the game
SetHighScore();
ResetGame();
requestAnimationFrame(loop);