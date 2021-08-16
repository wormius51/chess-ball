var position = [];

function setStartingPosition () {
   position = copyPosition(startPosition);
   position.turn = "white";
   position.castling = {white: {short: true, long: true}, black: {short: true, long: true}};
   position.ball = position[3][4];
}

const emptyPosition = [
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined]
];

const startPosition = [
    [Piece("black", "rook"), Piece("black", "knight"), Piece("black", "bishop"), Piece("black", "queen"), Piece("black", "king"), Piece("black", "bishop"), Piece("black", "knight"), Piece("black", "rook")],
    [Piece("black", "pawn"), Piece("black", "pawn"), Piece("black", "pawn"), Piece("black", "pawn"), Piece("black", "pawn"), Piece("black", "pawn"), Piece("black", "pawn"), Piece("black", "pawn")],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, Piece("nan", "ball"), undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [Piece("white", "pawn"), Piece("white", "pawn"), Piece("white", "pawn"), Piece("white", "pawn"), Piece("white", "pawn"), Piece("white", "pawn"), Piece("white", "pawn"), Piece("white", "pawn")],
    [Piece("white", "rook"), Piece("white", "knight"), Piece("white", "bishop"), Piece("white", "queen"), Piece("white", "king"), Piece("white", "bishop"), Piece("white", "knight"), Piece("white", "rook")]
];

function copyPosition(position) {
    let newPosition = [];
    for (let y = 0; y < position.length; y++) {
        newPosition.push([]);
        for (let x = 0; x < position[y].length; x++) {
            let piece = copyPiece(position[y][x]);
            newPosition[y].push(piece);
            if (piece && piece.type == "ball")
                newPosition.ball = piece;
        }
    }
    newPosition.turn = position.turn;
    if (position.castling) {
        newPosition.castling = {white: {
                short: position.castling.white.short,
                long: position.castling.white.long
            },
            black: {
                short: position.castling.black.short,
                long: position.castling.black.long
            }
        }
    }
    return newPosition;
}

function isTheSamePosition(a, b) {
    for (let y = 0; y < a.length; y++) {
        for (let x = 0; x < a[y].length; x++) {
            if (a[y][x] != b[y][x]) {
                if (!a[y][x] || !b[y][x]) {
                    return false;
                }
                if (a[y][x].team != b[y][x].team || a[y][x].type != b[y][x].type) {
                    return false;
                }
            }
        }
    }
    return true;
}

function numberToFile(num) {
    switch (num) {
        case 0:
            return "a";
        case 1:
            return "b";
        case 2:
            return "c";
        case 3:
            return "d";
        case 4:
            return "e";
        case 5:
            return "f";
        case 6:
            return "g";
        case 7:
            return "h";
    }
}

function positionAfterMove (position, move) {
    let afterPosition = copyPosition(position);
    positionPlayMove(afterPosition, move);
    return afterPosition;
}

function positionPlayMove (position, move) {
    
    let piece = position[move.sy][move.sx];
    position[move.sy][move.sx] = undefined;
    if (move.bx != undefined)
        position[move.by][move.bx] = position.ball;
    position[move.y][move.x] = piece;
    
    if (piece.type == "pawn") {
        let colorSign = (piece.team == "white") ? 1 : -1;
        if (position.enpassant && position.enpassant.x == move.x && position.enpassant.y == move.y)
            position[move.y + colorSign][move.x] = undefined;
        if ((move.sy - move.y) * colorSign > 1)
            position.enpassant = {x: move.x, y: move.y + colorSign, team: piece.team};
        if (move.promotion)
            piece.type = move.promotion;
    } else if (piece.type == "rook") {
        if (move.sx == 0)
            position.castling[piece.team].long = false;
        else
            position.castling[piece.team].short = false;
    } else if (piece.type == "king") {
        position.castling[piece.team].long = false;
        position.castling[piece.team].short = false;
        if (move.x - move.sx == -2) {
            let rook = position[move.y][0]
            position[move.y][move.x + 1] = rook;
            position[move.y][0] = undefined;
        } else if (move.x - move.sx == 2) {
            let rook = position[move.y][position[0].length - 1]
            position[move.y][move.x - 1] = rook;
            position[move.y][position[0].length - 1] = undefined;
        }
    }
    piece.firstMove = false;
    if (position.enpassant && position.turn != position.enpassant.team)
        position.enpassant = undefined;
    position.turn = (position.turn == "white") ? "black" : "white";
}