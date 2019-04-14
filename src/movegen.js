import {
    GameBoard,
    COLOURS,
    PIECES,
    PCEINDEX,
    RanksBrd,
    RANKS,
    SQUARES,
    BOOL,
    PieceCol,
    CASTLEBIT,
    SQOFFBOARD,
    LoopNonSlideIndex,
    LoopNonSlidePce,
    DirNum,
    PceDir,
    LoopSlideIndex,
    LoopSlidePce,
    MFLAGCA,
    MFLAGEP,
    MFLAGPS
} from './defs.js'
import {
    SqAttacked
} from './board.js';

function MOVE(from, to, captured, promoted, flag) {
    return (from | (to << 7) | (captured << 14) | (promoted << 20) | flag);
}

function AddCaptureMove(move) {
    GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = move;
    GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]++] = 0;

}

function AddQuietMove(move) {
    GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = move;
    GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]++] = 0;

}

function AddEnPassantMove(move) {
    GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = move;
    GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]++] = 0;

}

function AddWhitePawnCaptureMove(from, to, cap) {
    if (RanksBrd[from] == RANKS.RANK_7) {
        AddCaptureMove(MOVE(from, to, cap, PIECES.wQ, 0));
        AddCaptureMove(MOVE(from, to, cap, PIECES.wR, 0));
        AddCaptureMove(MOVE(from, to, cap, PIECES.wB, 0));
        AddCaptureMove(MOVE(from, to, cap, PIECES.wN, 0));
    } else {
        AddCaptureMove(MOVE(from, to, cap, PIECES.EMPTY, 0));
    }
}

function AddBlackPawnCaptureMove(from, to, cap) {
    if (RanksBrd[from] == RANKS.RANK_2) {
        AddCaptureMove(MOVE(from, to, cap, PIECES.bQ, 0));
        AddCaptureMove(MOVE(from, to, cap, PIECES.bR, 0));
        AddCaptureMove(MOVE(from, to, cap, PIECES.bB, 0));
        AddCaptureMove(MOVE(from, to, cap, PIECES.bN, 0));
    } else {
        AddCaptureMove(MOVE(from, to, cap, PIECES.EMPTY, 0));
    }
}

function AddWhitePawnQuietMove(from, to) {
    if (RanksBrd[from] == RANKS.RANK_7) {
        AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wQ, 0));
        AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wR, 0));
        AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wB, 0));
        AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wN, 0));
    } else {
        AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.EMPTY, 0));
    }
}

function AddBlackPawnQuietMove(from, to) {
    if (RanksBrd[from] == RANKS.RANK_7) {
        AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bQ, 0));
        AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bR, 0));
        AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bB, 0));
        AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bN, 0));
    } else {
        AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.EMPTY, 0));
    }
}


export function GenerateMoves() {

    GameBoard.moveListStart[GameBoard.ply + 1] = GameBoard.moveListStart[GameBoard.ply];

    let pceType, pceNum, sq, pceIndex, pce, t_sq, dir, index;

    if (GameBoard.side == COLOURS.WHITE) {
        pceType = PIECES.wP;

        for (pceNum = 0; pceNum < GameBoard.pceNum[pceType]; ++pceNum) {
            sq = GameBoard.pList[PCEINDEX(pceType, pceNum)];
            //Non-Capturing move for Pawn 
            if (GameBoard.pieces[sq + 10] == PIECES.EMPTY) {
                //Pawn regular quiet move, have to keep a track of pawn promotion
                AddWhitePawnQuietMove(sq, sq + 10);

                if (RanksBrd[sq] == RANKS.RANK_2 && GameBoard.pieces[sq + 20] == PIECES.EMPTY) {
                    //Quiet Pawn Move
                    AddQuietMove(MOVE(sq, sq + 20, PIECES.EMPTY, PIECES.EMPTY, MFLAGPS));
                }
            }
            // Capturing move for pawn
            if (SQOFFBOARD(sq + 9) == BOOL.FALSE && PieceCol[GameBoard.pieces[sq + 9]] == COLOURS.BLACK) {
                //generate capture move for pawn
                AddWhitePawnCaptureMove(sq, sq + 9, GameBoard.pieces[sq + 9]);
            }
            if (SQOFFBOARD(sq + 11) == BOOL.FALSE && PieceCol[GameBoard.pieces[sq + 11]] == COLOURS.BLACK) {
                //generate capture move for pawn
                AddWhitePawnCaptureMove(sq, sq + 11, GameBoard.pieces[sq + 11]);
            }
            if (GameBoard.enPas != SQUARES.NO_SQ) {
                if ((sq + 9) == GameBoard.enPas) {
                    //white pawn enPass move 
                    AddEnPassantMove(MOVE(sq, sq + 9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
                }
                if ((sq + 11) == GameBoard.enPas) {
                    //white pawn enPass move 
                    AddEnPassantMove(MOVE(sq, sq + 11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
                }
            }
        }
        //Generate the castle mov
        if (GameBoard.CastlePerm & CASTLEBIT.WKCA) {
            if (GameBoard.pieces[SQUARES.F1] == PIECES.EMPTY && GameBoard.pieces[SQUARES.G1] == PIECES.EMPTY) {
                if (SqAttacked(SQUARES.F1, COLOURS.BLACK) == BOOL.FALSE && SqAttacked(SQUARES.E1, COLOURS.BLACK) == BOOL.FALSE) {
                    //Add quiet move
                    AddQuietMove(MOVE(SQUARES.E1, SQUARES.G1, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA));
                }
            }
        }
        //Generate the castle mov
        if (GameBoard.CastlePerm & CASTLEBIT.WQCA) {
            if (GameBoard.pieces[SQUARES.B1] == PIECES.EMPTY && GameBoard.pieces[SQUARES.C1] == PIECES.EMPTY && GameBoard.pieces[SQUARES.D1] == PIECES.EMPTY) {
                if (SqAttacked(SQUARES.D1, COLOURS.BLACK) == BOOL.FALSE && SqAttacked(SQUARES.E1, COLOURS.BLACK) == BOOL.FALSE) {
                    //Add quiet move
                    AddQuietMove(MOVE(SQUARES.E1, SQUARES.C1, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA));
                }
            }
        }



    } else {
        pceType = PIECES.bP;

        for (pceNum = 0; pceNum < GameBoard.pceNum[pceType]; ++pceNum) {
            sq = GameBoard.pList[PCEINDEX(pceType, pceNum)];
            //Non-Capturing move for Pawn 
            if (GameBoard.pieces[sq - 10] == PIECES.EMPTY) {
                //Pawn quiet move which tracks promotion
                AddBlackPawnQuietMove(sq, sq - 10);
                if (RanksBrd[sq] == RANKS.RANK_2 && GameBoard.pieces[sq - 20] == PIECES.EMPTY) {
                    //Quiet Pawn Move
                    AddQuietMove(MOVE(sq, sq - 20, PIECES.EMPTY, PIECES.EMPTY, MFLAGPS));
                }
            }
            // Capturing move for pawn
            if (SQOFFBOARD(sq - 9) == BOOL.FALSE && PieceCol[GameBoard.pieces[sq - 9]] == COLOURS.WHITE) {
                //generate capture move for pawn
                AddWhitePawnCaptureMove(sq, sq - 9, GameBoard.pieces[sq - 9]);
            }
            if (SQOFFBOARD(sq - 11) == BOOL.FALSE && PieceCol[GameBoard.pieces[sq - 11]] == COLOURS.WHITE) {
                //generate capture move for pawn
                AddWhitePawnCaptureMove(sq, sq - 11, GameBoard.pieces[sq - 11]);
            }
            if (GameBoard.enPas != SQUARES.NO_SQ) {
                if ((sq - 9) == GameBoard.enPas) {
                    //black pawn enPass move 
                    AddEnPassantMove(MOVE(sq, sq - 9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
                }
                if ((sq - 11) == GameBoard.enPas) {
                    //black pawn enPass move 
                    AddEnPassantMove(MOVE(sq, sq - 11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
                }
            }
        }

        //Generate the castle mov
        if (GameBoard.CastlePerm & CASTLEBIT.BKCA) {
            if (GameBoard.pieces[SQUARES.F8] == PIECES.EMPTY && GameBoard.pieces[SQUARES.G8] == PIECES.EMPTY) {
                if (SqAttacked(SQUARES.F8, COLOURS.BLACK) == BOOL.FALSE && SqAttacked(SQUARES.E8, COLOURS.BLACK) == BOOL.FALSE) {
                    //Add quiet move
                    AddQuietMove(MOVE(SQUARES.E8, SQUARES.G8, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA));
                }
            }
        }
        //Generate the castle mov
        if (GameBoard.CastlePerm & CASTLEBIT.BQCA) {
            if (GameBoard.pieces[SQUARES.B8] == PIECES.EMPTY && GameBoard.pieces[SQUARES.C8] == PIECES.EMPTY && GameBoard.pieces[SQUARES.D8] == PIECES.EMPTY) {
                if (SqAttacked(SQUARES.D1, COLOURS.WHITE) == BOOL.FALSE && SqAttacked(SQUARES.E1, COLOURS.WHITE) == BOOL.FALSE) {
                    //Add quiet move
                    AddQuietMove(MOVE(SQUARES.E8, SQUARES.C8, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA));
                }
            }
        }

    }
    // Movegen set up for non sliding pieces
    //get Pce for side wN,wK
    //loop all dir for pce->need to know num of dir forEach piece

    pceIndex = LoopNonSlideIndex[GameBoard.side];
    pce = LoopNonSlidePce[pceIndex++];
    while (pce != 0) {
        for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
            sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
            for (index = 0; index < DirNum[pce]; index++) {
                dir = PceDir[pce][index];
                t_sq = sq + dir;
                if (SQOFFBOARD(t_sq) == BOOL.TRUE) {
                    continue;
                }
                if (GameBoard.pieces[t_sq] != PIECES.EMPTY) {
                    if (PieceCol[GameBoard.pieces[t_sq]] != GameBoard.side) {
                        //add capture
                        AddCaptureMove(MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0));
                    }
                } else {
                    //quiet move
                    AddQuietMove(MOVE(sq, t_sq, PIECES.EMPTY, PIECES.EMPTY, 0));
                }
            }
        }
        pce = LoopNonSlidePce[pceIndex++];
    }

    //Movegen setup for Sliding Pieces
    pceIndex = LoopSlideIndex[GameBoard.side];
    pce = LoopSlidePce[pceIndex++];

    while (pce != 0) {
        for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; ++pceNum) {
            sq = GameBoard.pList[PCEINDEX(pce, pceNum)];

            for (index = 0; index < DirNum[pce]; index++) {
                dir = PceDir[pce][index];
                t_sq = sq + dir;

                while (SQOFFBOARD(t_sq) == BOOL.FALSE) {

                    if (GameBoard.pieces[t_sq] != PIECES.EMPTY) {
                        if (PieceCol[GameBoard.pieces[t_sq]] != GameBoard.side) {
                            //add capture
                            AddCaptureMove(MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0));
                        }
                        break;
                    }
                    //add quiet move
                    AddQuietMove(MOVE(sq, t_sq, PIECES.EMPTY, PIECES.EMPTY, 0));
                    t_sq += dir;
                }
            }
        }
        pce = LoopSlidePce[pceIndex++];

    }

}