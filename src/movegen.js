import {
    GameBoard,
    COLOURS,
    PIECES,
    PCEINDEX,
    RanksBrd,
    RANKS,
    SQUARES,
    BOOL,
    PieceCol
} from './defs.js'

function MOVE(from, to, captured, promoted, flag) {
    return (from | (to << 7) | (captured << 14) | (promoted << 20) | flag);
}


function GenerateMoves() {

    GameBoard.moveListStart[GameBoard.ply + 1] = GameBoard.moveListStart[GameBoard.ply];

    let pceType, pceNum, sq;

    if (GameBoard.side === COLOURS.WHITE) {
        pceType = PIECES.wP;

        for (pceNum = 0; pceNum < GameBoard.pceNum[pceType]; ++pceType) {
            sq = GameBoard.pList[PCEINDEX(pceType, pceNum)];
            //Non-Capturing move for Pawn 
            if (GameBoard.pieces[sq + 10] === PIECES.EMPTY) {
                //Pawn move 
                if (RanksBrd[sq] === RANKS.RANK_2 && GameBoard.pieces[sq + 20] === PIECES.EMPTY) {
                    //Quiet Pawn Move
                }
            }
            // Capturing move for pawn
            if (SQOFFBOARD(sq + 9) === BOOL.FALSE && PieceCol[GameBoard.pieces[sq + 9]] === COLOURS.BLACK) {
                //generate capture move for pawn
            }
            if (SQOFFBOARD(sq + 11) === BOOL.FALSE && PieceCol[GameBoard.pieces[sq + 11]] === COLOURS.BLACK) {
                //generate capture move for pawn
            }
            if (GameBoard.enPas !== SQUARES.NO_SQ) {
                if ((sq + 9) === GameBoard.enPas) {
                    //white pawn enPass move 
                }
                if ((sq + 11) === GameBoard.enPas) {
                    //white pawn enPass move 
                }
            }
        }


        pceType = PIECES.wN;
    } else {
        pceType = PIECES.bP;

        for (pceNum = 0; pceNum < GameBoard.pceNum[pceType]; ++pceType) {
            sq = GameBoard.pList[PCEINDEX(pceType, pceNum)];
            //Non-Capturing move for Pawn 
            if (GameBoard.pieces[sq - 10] === PIECES.EMPTY) {
                //Pawn move 
                if (RanksBrd[sq] === RANKS.RANK_2 && GameBoard.pieces[sq - 20] === PIECES.EMPTY) {
                    //Quiet Pawn Move
                }
            }
            // Capturing move for pawn
            if (SQOFFBOARD(sq - 9) === BOOL.FALSE && PieceCol[GameBoard.pieces[sq - 9]] === COLOURS.WHITE) {
                //generate capture move for pawn
            }
            if (SQOFFBOARD(sq - 11) === BOOL.FALSE && PieceCol[GameBoard.pieces[sq - 11]] === COLOURS.WHITE) {
                //generate capture move for pawn
            }
            if (GameBoard.enPas !== SQUARES.NO_SQ) {
                if ((sq - 9) === GameBoard.enPas) {
                    //black pawn enPass move 
                }
                if ((sq - 11) === GameBoard.enPas) {
                    //black pawn enPass move 
                }
            }
        }



        pceType = PIECES.bN;

    }

}