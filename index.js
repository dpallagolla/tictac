/**
 * This program is a boliler plate code for the famous tic tac toe game
 * Here box represents one placeholder for either X or a 0
 * We have a 2D array to represent the arrangement of X or O is a grid
 * 0 -> empty box
 * 1 -> box with X
 * 2 -> box with O
 * 
 * Below are the tasks which needs to be completed
 * Imagine you are playing with Computer so every alternate move should be by Computer
 * X -> player
 * O -> Computer
 * 
 * Winner has to be decided and has to be flashed
 * 
 * Extra points will be given for the Creativity
 * 
 * Use of Google is not encouraged
 * 
 */
const grid = [];
const GRID_LENGTH = 3;
let turn = 'X';
const RESULT = {
    incomplete: "0",
    humanWon: "1",
    computerWon: "2",
    tie: "3"
  }


function initializeGrid() {
    for (let colIdx = 0;colIdx < GRID_LENGTH; colIdx++) {
        const tempArray = [];
        for (let rowidx = 0; rowidx < GRID_LENGTH;rowidx++) {
            tempArray.push(0);
        }
        grid.push(tempArray);
    }
}

function getRowBoxes(colIdx) {
    let rowDivs = '';
    
    for(let rowIdx=0; rowIdx < GRID_LENGTH ; rowIdx++ ) {
        let additionalClass = 'darkBackground';
        let content = '';
        const sum = colIdx + rowIdx;
        if (sum%2 === 0) {
            additionalClass = 'lightBackground'
        }
        const gridValue = grid[colIdx][rowIdx];
        if(gridValue === 1) {
            content = '<span class="cross">X</span>';
        }
        else if (gridValue === 2) {
            content = '<span class="cross">O</span>';
        }
        rowDivs = rowDivs + '<div colIdx="'+ colIdx +'" rowIdx="' + rowIdx + '" class="box ' +
            additionalClass + '">' + content + '</div>';
    }
    return rowDivs;
}

function getColumns() {
    let columnDivs = '';
    for(let colIdx=0; colIdx < GRID_LENGTH; colIdx++) {
        let coldiv = getRowBoxes(colIdx);
        coldiv = '<div class="rowStyle">' + coldiv + '</div>';
        columnDivs = columnDivs + coldiv;
    }
    return columnDivs;
}

function renderMainGrid() {
    const parent = document.getElementById("grid");
    const columnDivs = getColumns();
    parent.innerHTML = '<div class="columnsStyle">' + columnDivs + '</div>';
}

// algo

function moveCount(board){
    let moveCount = 0
    for (let i = 0; i<board.length; i++){
      for (let j = 0 ; j<board[i].length ; j++){
        if (board[i][j]!=""){
          moveCount++
        }
      }
    }
    return moveCount
  }

function getResult(board,symbol){
    let result = RESULT.incomplete
    if (moveCount(board)<5){
       return {result}
    }

    function succession (line){
      return (line === symbol.repeat(3))
    }

    let line
    let winningLine=[]

    for (var i = 0 ; i<3 ; i++){
      line = board[i].join('')
      if(succession(line)){
        result = symbol;
        winningLine = [[i,0], [i,1], [i,2]]
        return {result, winningLine};
      }
    }

    for (var j=0 ; j<3; j++){
      let column = [board[0][j],board[1][j],board[2][j]]
      line = column.join('')
      if(succession(line)){
        result = symbol
        winningLine = [[0,j], [1,j], [2,j]]
        return {result, winningLine};
      }
    }

    let diag1 = [board[0][0],board[1][1],board[2][2]]
    line = diag1.join('')
    if(succession(line)){
      result = symbol
      winningLine = [[0,0], [1,1], [2,2]]
      return {result, winningLine};
    }

    let diag2 = [board[0][2],board[1][1],board[2][0]]
    line = diag2.join('')
    if(succession(line)){
      result = symbol
      winningLine = [[0,2], [1,1], [2,0]]
      return {result, winningLine};
    }

    //Check for tie
    if (moveCount(board)==9){
      result=RESULT.tie
      return {result, winningLine}
    }

    return {result}
  }

  function getBestMove (board, symbol){
    function copyBoard(board) {
      let copy = []
       for (let row = 0 ; row<3 ; row++){
        copy.push([])
        for (let column = 0 ; column<3 ; column++){
          copy[row][column] = board[row][column]
        }
      }
      return copy
    }

    function getAvailableMoves (board) {
      let availableMoves = []
      for (let row = 0 ; row<3 ; row++){
        for (let column = 0 ; column<3 ; column++){
          if (board[row][column]===0){
            availableMoves.push({row, column})
          }
        }
      }
      return availableMoves
    }

    function shuffleArray (array){
        for (var i = array.length - 1; i > 0; i--) {
            var rand = Math.floor(Math.random() * (i + 1));
            [array[i], array[rand]]=[array[rand], array[i]]
        }
    }

    let availableMoves = getAvailableMoves(board)
    let availableMovesAndScores = []

    for (var i=0 ; i<availableMoves.length ; i++){
      let move = availableMoves[i]
      let newBoard = copyBoard(board)
      newBoard[move.row][move.column] = symbol
      result = getResult(newBoard,symbol).result
      let score
      if (result == RESULT.tie) {score = 0}
      else if (result == symbol) {
        score = 1
      }
      else {
        let otherSymbol = (symbol=="1")? "2" : "1"
        nextMove = getBestMove(newBoard, otherSymbol)
        score = - (nextMove.score)
      }
      if(score === 1)
        return {move, score}
      availableMovesAndScores.push({move, score})
    }

    shuffleArray(availableMovesAndScores)

    availableMovesAndScores.sort((moveA, moveB )=>{
        return moveB.score - moveA.score
      })
    return availableMovesAndScores[0]
  }

  function doComputerMove (){
    let symbol = "2"
    let move = getBestMove(grid, symbol).move
    grid[move.row][move.column] = 2;
  }

// algo

function onBoxClick() {
    var rowIdx = this.getAttribute("rowIdx");
    var colIdx = this.getAttribute("colIdx");
    let newValue = 1;
    grid[colIdx][rowIdx] = newValue;
    renderMainGrid();
    addClickHandlers();
    
    let result = getResult(grid,"1").result;
    if(result == RESULT.tie) {
        setTimeout(function(){ document.getElementById('Tielight').style.display='block';
        document.getElementById('Tiefade').style.display='block';},1000);
       
    } else if(result == RESULT.humanWon) {
        alert("This should not happen!");
    }

    if(result == RESULT.incomplete) {
        doComputerMove();
        renderMainGrid();
        addClickHandlers();
        let result = getResult(grid,"2").result;
        if(result == RESULT.tie) {
            setTimeout(function(){ document.getElementById('Tielight').style.display='block';
            document.getElementById('Tiefade').style.display='block';},1000);   
        } else if(result == RESULT.computerWon) {
            setTimeout(function(){ 
            document.getElementById('Computerlight').style.display='block';
            document.getElementById('Computerfade').style.display='block';
        },1000);
           
        }
    }

    // The algorithm awesomeness ends


}

function addClickHandlers() {
    var boxes = document.getElementsByClassName("box");
    for (var idx = 0; idx < boxes.length; idx++) {
        if(boxes[idx].innerText.toString().indexOf('O') == -1 &&  boxes[idx].innerText.toString().indexOf('X') == -1 ) {
            boxes[idx].addEventListener('click', onBoxClick, false);
        }
    }
}

initializeGrid();
renderMainGrid();
addClickHandlers();
