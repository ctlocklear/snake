
function makeBoard () {
  board = [];

  for (var i = 0; i < boardSize; i++) {
    var row = []; 
    for (var j = 0; j < boardSize; j++) {
      row.push(null); 
    };
    board.push(row); 
  };
};

function makeSnake () {
  snake = [];

  for (var i = 0; i < initialLength; i++) {
    snake.push( [initialRow, initialColumn + i] );
  };
};

function makeApple () {
  function randomCoordinate () {
    return [
      Math.floor(boardSize * Math.random()),
      Math.floor(boardSize * Math.random())
    ];
  };

  function isFull (coord) {
    return board[ coord[0] ][ coord[1] ] != null;
  };

  apple = randomCoordinate();

  while ( isFull(apple) ) {
    apple = randomCoordinate();
  };
};

function updateBoard () {

  for (var i = 0; i < board.length; i++) {
    var row = board[i]; 

    for (var j = 0; j < row.length; j++) {
      row[j] = null;
    };
  };

  // then add in the snake
  for (var i = 0; i < snake.length; i++) {
    var part = snake[i];

    if (i == 0) { 
      board[part[0]][part[1]] = 'h';
    } else { 
      board[part[0]][part[1]] = 'b';
    };
  };

 
  board[apple[0]][apple[1]] = 'a';
};

function render () {
  var $game = $( '#game' );
  var $ul = $( '<ul>' );

  for (var i=0; i < board.length; i++) {
    var row = board[i];

    for (var j=0; j < row.length; j++) {
      var $li = $( '<li>' );
      if (row[j] == 'h') {
        $li.addClass('snake-head');
      } else if (row[j] == 'b') {
        $li.addClass('snake-body');
      } else if (row[j] == 'a') {
        $li.addClass('apple');
      };

      $ul.append( $li );
    };
  };

  $game.html( $ul );
};

function moveSnake () {
  var currentHead = snake[0];

  var newHead = [
    currentHead[0] + currentDirection[0],
    currentHead[1] + currentDirection[1]
  ];

 
  if (newHead[0] < 0 || newHead[0] > 19 ||
    newHead[1] < 0 || newHead[1] > 19) {
    return false;
  };


  for (var i = 0; i < snake.length - 1; i++) {
    if (newHead[0] == snake[i][0] &&
      newHead[1] == snake[i][1]) {
        return false;
    };
  };

 
  if (newHead[0] == apple[0] && newHead[1] == apple[1]) {
  
    snake.unshift(newHead);
   
    makeApple();
  } else {
    snake.pop();
    snake.unshift(newHead);
  };

  return true;
};

function setNextDirection () {
 
  var arrowCodes = [37, 38, 39, 40];
  var directions = [
    [0, -1], [-1, 0], [0, 1], [1, 0]
  ];

  var code = event.keyCode;
  var codeIndex = arrowCodes.indexOf(code);

  if (codeIndex != -1) {
    currentDirection = directions[codeIndex];
  };
};

function completeNextDirection () {
  if (moveSnake()) {
   
    updateBoard();
    render();
  } else {
   
    $('body').append('<h2>You lose!</h2>');
    $('body').off('keydown');
    clearInterval(gameIntervalID);
  };
};

var board, snake, apple, boardSize, loopSpeed;
var initialRow, initialColumn, initialLength, currentDirection;
var gameIntervalID;

function startGame () {
 
  boardSize = 20;
  loopSpeed = 200;
  initialRow = 10;
  initialColumn = 10;
  initialLength = 5;
  currentDirection = [0, -1];

 
  makeBoard();
  makeSnake();
  makeApple();
  updateBoard();

  
  render();

 
  $('body').keydown(function (event) {
    setNextDirection();
  });

  gameIntervalID = setInterval(completeNextDirection, loopSpeed);
};
