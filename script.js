const Player = (symbol, name) => {
    this.symbol = symbol;
    this.name = name;

    const getSymbol = () => {
        return symbol;
    };

    const getName = () => {
        return name;
    };

    return { getSymbol, getName };

}

let playerX;
let playerO;

const gameBoard = (() => {
    const cells = document.querySelectorAll(".cell");
    let board = ["", "", "", "", "", "", "", "", ""];

    const setBoard = () => {
        for(let i = 0; i < Array.from(cells).length; i++) {
            cells[i].textContent = board[i];
        }
    };

    return { board, setBoard };

})();

const displayController = (() => {
    const cells = document.querySelectorAll(".cell");
    const p1 = document.getElementById("one");
    const p2 = document.getElementById("two");
    const enterName = document.getElementsByClassName("choose-name")[0];
    const submit = document.getElementById("submit")
    const displayText = document.querySelector(".display");
    const restartButton = document.getElementById("restart");
    const resetButton = document.getElementById("reset");

    const showSymbol = (e) => {
        if (!e.target.textContent && playerX && playerO) {
            let symbol = gameController.returnPlayer().getSymbol();
            e.target.textContent = symbol;
            gameBoard.board[e.target.classList[1]] = symbol;
            if (typeof(gameController.checkWinner()) == 'object') {
                winningDisplay(gameController.checkWinner());
            } else if (gameController.checkWinner() == "draw") {
                drawingDisplay();
            } else {
                gameController.changePlayer();
                changeDisplay();
            }
        }
    };

    const changeDisplay = () => {
        let player = gameController.returnPlayer();
        displayText.textContent = `It's ${player.getName()}'s turn to move ( ${player.getSymbol()} )`
    };

    const winningDisplay = (player) => {
        displayText.textContent = `${player.getName()} has won! Click restart to play again or reset to choose new opponents!`
        Array.from(cells).forEach((cell) => {
            cell.removeEventListener("click", showSymbol, false);
        });
    }

    const drawingDisplay = () => {
        displayText.textContent = `It's a draw! Click restart to play again or reset to choose new opponents!`
        Array.from(cells).forEach((cell) => {
            cell.removeEventListener("click", showSymbol, false);
        });
    }


    const chooseName = () => {
        if (p1.value && p2.value) {
            playerX = Player("X", p1.value);
            playerO = Player("O", p2.value);
            gameController.setPlayer();
            changeDisplay();
            document.body.removeChild(enterName);
        }
    };

    submit.addEventListener("click", chooseName, false);

    Array.from(cells).forEach((cell) => {
        cell.addEventListener("click", showSymbol, false);
    });

    const restart = () => {
        gameBoard.board = ["", "", "", "", "", "", "", "", ""];
        gameController.setPlayer();
        changeDisplay();
        Array.from(cells).forEach((cell) => {
            cell.textContent = '';
            cell.addEventListener("click", showSymbol, false);
        });
    };

    if (playerX && playerO) restartButton.addEventListener("click", restart, false);

    const reset = () => {
        location.reload();
    }

    resetButton.addEventListener("click", reset, false);

    return { restart, reset };

})();

const gameController = (() => {
    let playerTurn;

    const setPlayer = () => {
        playerTurn = playerX;
    };

    const returnPlayer = () => {
        return playerTurn;
    };

    const changePlayer = () => {
        playerTurn = (playerTurn === playerX) ? playerO : playerX;
    };

    const checkWinner = () => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]
        let player = returnPlayer();
        let playerSymbol = returnPlayer().getSymbol();

        for (condition of winConditions) {
            if (gameBoard.board[condition[0]] == playerSymbol && gameBoard.board[condition[1]] == playerSymbol && gameBoard.board[condition[2]] == playerSymbol) return player;
        }
        for (cell of gameBoard.board) {
            if (cell.length == 0) return false;
        }
        return "draw";
    };

    return { setPlayer, returnPlayer, changePlayer, checkWinner };

})();

