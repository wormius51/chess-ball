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

let draggedPiece = undefined;
let kickingPiece = undefined;
let mouseX = 0;
let mouseY = 0;

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

function drawPiece (piece, file, rank, size) {
    if (!piece)
        return;
    if (!size)
        size = 1;
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
            context.drawImage(ballImage, file * squareEdgeLengh, rank * squareEdgeLengh, squareEdgeLengh * size, squareEdgeLengh * size);
            return;
        default:
            return;
    }
    context.drawImage(piecesImage, pieceX * pieceEdgeLength, pieceY * pieceEdgeLength, pieceEdgeLength, pieceEdgeLength, file * squareEdgeLengh, rank * squareEdgeLengh, squareEdgeLengh * size, squareEdgeLengh * size);
}

function drawPieces () {
    for (let file = 0; file < boardWidth; file++)
        for (let rank = 0; rank < boardHeight; rank++) {
            if (!position[rank] || !position[rank][file])
                continue;
            if (position[rank][file] != draggedPiece) {
                if (position[rank][file] != kickingPiece)
                    drawPiece(position[rank][file], file, rank);
            } else if (position[rank][file] == position.ball) {
                drawPiece(kickingPiece, file, rank);
            }
            
        }
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

function drawPromotionOptions (x, y, type, team) {
    drawPiece(Piece(team, type), x, y, 0.5);
}

function drawMoveOptions () {
    possibleMoves.forEach(move => {
        if (move.ballMoves) {
            move.ballMoves.forEach(ballMove => {
                if (!(ballMove.bx == ballMove.sx && ballMove.by == ballMove.sy))
                    drawMoveOption(ballMove.bx, ballMove.by, ballMoveColor);
            });
        }
        if (move.promotion) {
            drawPromotionOptions(move.x + move.xInSquare, move.y + move.yInSquare, move.promotion, position.turn);
        }
    });
    possibleMoves.forEach(move => {
        if (move.bx != undefined)
            drawMoveOption(move.bx, move.by, ballMoveColor);
        else if (move.promotion == undefined)
            drawMoveOption(move.x, move.y);
    });
}

function drawDraggedPiece () {
    drawPiece(draggedPiece, mouseX, mouseY);
}

function drawBoard () {
    setBoardCanvasSize();
    drawSquares();
    drawPieces();
    drawMoveOptions();
    if (draggedPiece)
        drawDraggedPiece();
}