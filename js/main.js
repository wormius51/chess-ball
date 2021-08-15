window.addEventListener('load', () => {
    setStartingPosition();
    drawBoard();
});

canvas.addEventListener('click', event => {
    selectCanvas(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
});

var possibleMoves = [];

function selectCanvas (x, y) {
    let file = Math.floor(x / squareEdgeLengh);
    let rank = Math.floor(y / squareEdgeLengh);
    let xInSquare = x / squareEdgeLengh - file;
    let yInSquare = y / squareEdgeLengh - rank;
    selectSquare(file, rank, xInSquare, yInSquare);
}

function selectSquare (file, rank, xInSquare, yInSquare) {
    let move = possibleMoves.find(m => {
        return ((m.x == file && m.y == rank) || 
        (m.bx == file && m.by == rank)) &&
        (m.xInSquare == undefined || (
        m.xInSquare <= xInSquare &&
        m.xInSquare > xInSquare - 0.5 &&
        m.yInSquare <= yInSquare &&
        m.yInSquare > yInSquare - 0.5))
    });
    if (move) {
        if (!move.ballMoves && !move.promotions)
            positionPlayMove(position, move);
    }
    else {
        let ballMove = null;
        let kickMove = possibleMoves.find(m => {
            if (!m.ballMoves)
                return false;
            ballMove = m.ballMoves.find(bm => {
                return bm.bx == file && bm.by == rank;
            });
            return ballMove;
        });
        if (kickMove)
            positionPlayMove(position, ballMove);
    }
    if (move) {
        if (move.ballMoves)
            possibleMoves = move.ballMoves;
        else if (move.promotions)
            possibleMoves = move.promotions;
        else
            possibleMoves = [];
    } else {
        possibleMoves = getMovesOfPiece(position, file, rank);
    }
    drawBoard();
    
}