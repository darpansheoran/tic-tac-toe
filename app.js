angular.module("ticTacToeApp", []);

angular.module("ticTacToeApp").controller("gameController", [
  "$scope",
  "GameDataService",
  function ($scope, GameDataService) {
    var player1 = "X";
    var player2 = "O";
    // to keep track of number of turns
    var played = null;
    $scope.currentPlayer = player1;
    // size of board
    $scope.size = 3;
    // number of X/O needed to win.
    $scope.numberToWin = 3;
    // count draws and wins
    $scope.drawCount = 0;
    $scope.player1Wins = 0;
    $scope.player2Wins = 0;

    $scope.$watch("winner", function () {
      // inc player wins variable and reset board
      if ($scope.winner == "X") {
        $scope.player1Wins++;
      } else if ($scope.winner == "O") {
        $scope.player2Wins++;
      }
    });

    $scope.$watch("draw", function (newValue, oldValue) {
      // reset board in case of a draw
      if (newValue) {
        $scope.drawCount++;
      }
    });

    // initialize function for every game
    var initData = function () {
      played = [];
      $scope.line = null;
      $scope.winner = null;
      $scope.draw = null;
      $scope.board = GameDataService.createBoard($scope.size);
    };

    // evaluate the turn
    var evaluateTurn = function () {
      // filter moves by current player
      var movesByPlayer = _.filter(played, { player: $scope.currentPlayer });
      if (movesByPlayer.length < $scope.numberToWin) {
        return; //not enough moves, don't bother checking
      }

      var diagonalDownCount = 0; //00, 11, 22 - diagonal top left to bottom right positions
      var diagonalUpCount = 0; //20, 11, 02 - diagonal bottom left to top right positions

      for (var i = 0; i < $scope.numberToWin; i++) {
        var rowCount = 0; //check every row
        var colCount = 0; //check every column
        var diagonalUpIndex = $scope.numberToWin - 1 - i; //2, 1, 0 diagonal up column index

        // evaluate each move of current player to check if there is any winner
        _.each(movesByPlayer, function (move) {
          // in case of winner one/more of these variables will become 3/numberToWin
          if (move.row === i && move.col === i) {
            diagonalDownCount += 1;
          }
          if (move.row === diagonalUpIndex && move.col === i) {
            diagonalUpCount += 1;
          }
          if (move.row === i) {
            rowCount += 1;
          }
          if (move.col === i) {
            colCount += 1;
          }
          if (
            diagonalUpCount === $scope.numberToWin ||
            diagonalDownCount === $scope.numberToWin ||
            colCount === $scope.numberToWin ||
            rowCount === $scope.numberToWin
          ) {
            // to apply winning animation
            if (diagonalUpCount === $scope.numberToWin) {
              $scope.board[2].won = true;
              $scope.board[4].won = true;
              $scope.board[6].won = true;
              $scope.line = 2;
            } else if (diagonalDownCount === $scope.numberToWin) {
              $scope.board[0].won = true;
              $scope.board[4].won = true;
              $scope.board[8].won = true;
              $scope.line = 1;
            } else if (colCount === $scope.numberToWin) {
              if (move.col == 0) {
                $scope.board[0].won = true;
                $scope.board[3].won = true;
                $scope.board[6].won = true;
                $scope.line = 3;
              } else if (move.col == 1) {
                $scope.board[1].won = true;
                $scope.board[4].won = true;
                $scope.board[7].won = true;
                $scope.line = 4;
              } else {
                $scope.board[2].won = true;
                $scope.board[5].won = true;
                $scope.board[8].won = true;
                $scope.line = 5;
              }
            } else {
              if (move.row == 0) {
                $scope.board[0].won = true;
                $scope.board[1].won = true;
                $scope.board[2].won = true;
                $scope.line = 6;
              } else if (move.row == 1) {
                $scope.board[3].won = true;
                $scope.board[4].won = true;
                $scope.board[5].won = true;
                $scope.line = 7;
              } else {
                $scope.board[6].won = true;
                $scope.board[7].won = true;
                $scope.board[8].won = true;
                $scope.line = 8;
              }
            }
            $scope.winner = $scope.currentPlayer;
            return;
          }
        });
      }

      //no winner but all positions have been played
      if (
        played.length === $scope.size * $scope.size &&
        $scope.winner == null
      ) {
        $scope.draw = true;
      }
    };

    var changePlayer = function () {
      $scope.currentPlayer =
        $scope.currentPlayer === player1 ? player2 : player1;
    };

    // event func. for click on board
    this.playTurn = function (positionInfo) {
      if ($scope.winner) {
        return;
      }

      if (positionInfo.player !== null) {
        return;
      }

      positionInfo.player = $scope.currentPlayer;
      played.push(positionInfo);
      evaluateTurn();

      if (!$scope.winner) {
        //change players if no winner
        changePlayer();
      }
    };

    // resets wins/draw variable and board
    this.newGame = function () {
      initData();
    };
    this.resetScore = function () {
      initData();
      $scope.drawCount = 0;
      $scope.player1Wins = 0;
      $scope.player2Wins = 0;
      $scope.currentPlayer = player1;
    };

    initData();
  },
]);

angular.module("ticTacToeApp").factory("GameDataService", function () {
  var service = {};

  // returns an array of objects; each object has a row, col and player prop.
  service.createBoard = function (boardsize) {
    var data = [];
    for (var i = 0; i < boardsize; i++) {
      for (var j = 0; j < boardsize; j++) {
        data.push({ row: i, col: j, player: null });
      }
    }
    return data;
  };

  return service;
});
