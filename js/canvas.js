const canvas = document.getElementById("boardCanvas");
const context = canvas.getContext("2d");

const boardHeight = 8;
const boardWidth = 8;

let squareEdgeLengh = 70;
const pieceEdgeLength = 320;
const moveOptionRadius = 0.4;

let lightSquareColor = "rgb(200, 200, 255)";
let darkSquareColor = "rgb(37, 10, 122)";
let moveOptionColor = "#10fd30d3";
let ballMoveColor = "grey";

function setBoardCanvasSize () {
    canvas.height = boardHeight * squareEdgeLengh;
    canvas.width = boardWidth * squareEdgeLengh;
}

function drawSquares () {
    for (let file = 0; file < boardWidth; file++) {
        for (let rank = 0; rank < boardHeight; rank++) {
            context.fillStyle = ((file + rank) % 2 == 0) ? lightSquareColor : darkSquareColor;
            context.fillRect(file * squareEdgeLengh, rank * squareEdgeLengh,  squareEdgeLengh, squareEdgeLengh);
        }
    }
}

function drawPiece (piece, file, rank) {
    if (!piece)
        return;
    let pieceX = 0;
    let pieceY = (piece.team == "white") ? 0 : 1;
    switch (piece.type) {
        case "king":
            pieceX = 0;
            break;
        case "queen":
            pieceX = 1;
            break;
        case "bishop":
            pieceX = 2;
            break;
        case "knight":
            pieceX = 3;
            break;
        case "rook":
            pieceX = 4;
            break;
        case "pawn":
            pieceX = 5;
            break;
        case "ball":
            context.drawImage(ballImage, file * squareEdgeLengh, rank * squareEdgeLengh, squareEdgeLengh, squareEdgeLengh);
            return;
        default:
            return;
    }
    context.drawImage(piecesImage, pieceX * pieceEdgeLength, pieceY * pieceEdgeLength, pieceEdgeLength, pieceEdgeLength, file * squareEdgeLengh, rank * squareEdgeLengh, squareEdgeLengh, squareEdgeLengh);
}

function drawPieces () {
    for (let file = 0; file < boardWidth; file++)
        for (let rank = 0; rank < boardHeight; rank++)
            drawPiece(position[rank][file], file, rank);
}

function drawMoveOption (file, rank, color) {
    context.fillStyle = color? color : moveOptionColor;
    context.beginPath();
    let radius = moveOptionRadius * squareEdgeLengh / 2;
    let centerX = (file + 0.5) * squareEdgeLengh;
    let centerY = (rank + 0.5) * squareEdgeLengh;
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
}

function drawMoveOptions () {
    possibleMoves.forEach(move => {
        if (move.ballMoves) {
            move.ballMoves.forEach(ballMove => {
                drawMoveOption(ballMove.bx, ballMove.by, ballMoveColor);
            });
        }
    });
    possibleMoves.forEach(move => {
        if (move.bx != undefined)
            drawMoveOption(move.bx, move.by, ballMoveColor);
        else
            drawMoveOption(move.x, move.y);
    });
}

function drawBoard () {
    setBoardCanvasSize();
    drawSquares();
    drawPieces();
    drawMoveOptions();
}