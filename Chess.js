const chessboard = document.getElementById('chessboard');
const pieces = {
    'r': '♖', 'n': '♘', 'b': '♗', 'q': '♕', 'k': '♔', 'p': '♙',
    'R': '♜', 'N': '♞', 'B': '♝', 'Q': '♛', 'K': '♚', 'P': '♟'
};

let board = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

let selectedPiece = null;
let selectedSquare = null;
let isWhiteTurn = true;

function createBoard() {
    chessboard.innerHTML = '';
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.className = 'square ' + ((row + col) % 2 === 0 ? 'white' : 'black');
            square.dataset.row = row;
            square.dataset.col = col;

            if (board[row][col] !== ' ') {
                const piece = document.createElement('span');
                piece.className = 'piece';
                piece.innerHTML = pieces[board[row][col]];
                square.appendChild(piece);
            }

            square.addEventListener('click', () => handleSquareClick(row, col));
            chessboard.appendChild(square);
        }
    }
}

function handleSquareClick(row, col) {
    if (selectedPiece) {
        // Mover la pieza
        if (isValidMove(selectedSquare.row, selectedSquare.col, row, col)) {
            board[row][col] = selectedPiece;
            board[selectedSquare.row][selectedSquare.col] = ' ';
            selectedPiece = null;
            selectedSquare = null;
            isWhiteTurn = !isWhiteTurn;
            createBoard();
            if (!isWhiteTurn) {
                setTimeout(botMove, 500); // Esperar medio segundo antes de que el bot mueva
            }
        } else {
            alert("Movimiento inválido.");
            selectedPiece = null;
            selectedSquare = null;
        }
    } else {
        // Seleccionar la pieza
        const piece = board[row][col];
        if ((isWhiteTurn && piece === piece.toUpperCase()) || (!isWhiteTurn && piece === piece.toLowerCase())) {
            selectedPiece = piece;
            selectedSquare = { row, col };
        }
    }
}

function isValidMove(fromRow, fromCol, toRow, toCol) {
    const piece = board[fromRow][fromCol];
    const targetPiece = board[toRow][toCol];

    // Comprobar si el movimiento es a una casilla válida
    if (targetPiece !== ' ' && ((isWhiteTurn && targetPiece === targetPiece.toUpperCase()) || (!isWhiteTurn && targetPiece === targetPiece.toLowerCase()))) {
        return false; // No puedes comer tu propia pieza
    }

    // Movimiento básico (solo para peones y torres)
    if (piece.toLowerCase() === 'p') {
        // Movimiento de peón
        if (isWhiteTurn) {
            if (fromRow === 6 && toRow === 4 && fromCol === toCol && targetPiece === ' ') {
                return true; // Movimiento de dos casillas
            }
            if (toRow === fromRow - 1 && fromCol === toCol && targetPiece === ' ') {
                return true; // Movimiento de una casilla
            }
            if (toRow === fromRow - 1 && Math.abs(fromCol - toCol) === 1 && targetPiece !== ' ') {
                return true; // Captura
            }
        } else {
            if (fromRow === 1 && toRow === 3 && fromCol === toCol && targetPiece === ' ') {
                return true; // Movimiento de dos casillas
            }
            if (toRow === fromRow + 1 && fromCol === toCol && targetPiece === ' ') {
                return true; // Movimiento de una casilla
            }
            if (toRow === fromRow + 1 && Math.abs(fromCol - toCol) === 1 && targetPiece !== ' ') {
                return true; // Captura
            }
        }
    }

    // Movimiento de torre
    if (piece.toLowerCase() === 'r') {
        if (fromRow === toRow || fromCol === toCol) {
            return true; // Movimiento horizontal o vertical
        }
    }

    return false; // Movimiento no válido
}

function botMove() {
    let validMoves = [];
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if ((isWhiteTurn && piece === piece.toUpperCase()) || (!isWhiteTurn && piece === piece.toLowerCase())) {
                for (let targetRow = 0; targetRow < 8; targetRow++) {
                    for (let targetCol = 0; targetCol < 8; targetCol++) {
                        if (isValidMove(row, col, targetRow, targetCol)) {
                            validMoves.push({ from: { row, col }, to: { row: targetRow, col: targetCol } });
                        }
                    }
                }
            }
        }
    }

    if (validMoves.length > 0) {
        const move = validMoves[Math.floor(Math.random() * validMoves.length)];
        board[move.to.row][move.to.col] = board[move.from.row][move.from.col];
        board[move.from.row][move.from.col] = ' ';
        isWhiteTurn = !isWhiteTurn;
        createBoard();
    }
}

createBoard();  