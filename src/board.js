// import {
//     *
// } from './defs'

import {
    BOOL,
    BRD_SQ_NUM,
    COLOURS,
    PCEINDEX,
    MAXDEPTH,
    MAXPOSITIONMOVES,
    SQUARES,
    SQ120,
    PIECES,
    RANKS,
    FILES,
    FR2SQ,
    PieceKeys,
    SideKey,
    CastleKeys,
    RankChar,
    PceChar,
    FileChar,
    SideChar,
    CASTLEBIT,
    GameBoard,
    PieceCol,
    PieceVal,
    KnDir,
    PieceKnight,
    RkDir,
    PieceRookQueen,
    PieceKing,
    BiDir,
    KiDir,
    PieceBishopQueen

} from './defs.js';
import {
    PrSq
} from './io.js';

export function PrintBoard() {
    let sq, file, rank, piece;
    console.log('\nGame Board:\n\n');
    for (rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank--) {
        let line = (RankChar[rank] + '  ');
        for (file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
            sq = FR2SQ(file, rank);
            piece = GameBoard.pieces[sq];
            line += (' ' + PceChar[piece] + ' ');
        }
        console.log(line);
    }
    console.log('');
    let line = "  ";
    for (file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
        line += (' ' + FileChar[file] + ' ');
    }
    console.log(line);
    console.log('side:' + SideChar[GameBoard.side]);
    console.log('enPass:' + GameBoard.enPas);
    line = "";
    if (GameBoard.CastlePerm & CASTLEBIT.WKCA) line += 'K';
    if (GameBoard.CastlePerm & CASTLEBIT.WQCA) line += 'Q';
    if (GameBoard.CastlePerm & CASTLEBIT.BKCA) line += 'k';
    if (GameBoard.CastlePerm & CASTLEBIT.BQCA) line += 'q';
    console.log('castle:' + line);
    console.log('key:' + GameBoard.posKey.toString(16));


};








export function GeneratePosKey() {

    let sq = 0;
    let finalKey = 0;
    let piece = PIECES.EMPTY;

    for (sq = 0; sq < BRD_SQ_NUM; ++sq) {
        piece = GameBoard.pieces[sq];
        if (piece != PIECES.EMPTY && piece != SQUARES.OFFBOARD) {
            finalKey ^= PieceKeys[(piece * 120) + sq];
        }
    }

    if (GameBoard.side == COLOURS.WHITE) {
        finalKey ^= SideKey;
    }

    if (GameBoard.enPas != SQUARES.NO_SQ) {
        finalKey ^= PieceKeys[GameBoard.enPas];
    }

    finalKey ^= CastleKeys[GameBoard.CastlePerm];

    return finalKey;
};

//print pieceLists in algebraic notation

function PrintPieceLists() {
    let piece, pceNum;
    for (piece = PIECES.wP; piece <= PIECES.bK; ++piece) {
        for (pceNum = 0; pceNum < GameBoard.pceNum[piece]; ++pceNum) {
            console.log(' piece ' + PceChar[piece] + ' on ' + PrSq(GameBoard.pList[PCEINDEX(piece, pceNum)]));
        }
    }
}

// UPDATES GLOBAL PIECELIST ARRAY WHICH HOLDS, AS MANY PIECES OF EACHTYPE
export function UpdateListsMaterial() {
    let piece, sq, index, colour;
    for (index = 0; index < 14 * 120; ++index) {
        GameBoard.pList[index] = PIECES.EMPTY;
    }
    for (index = 0; index < 2; ++index) {
        GameBoard.material[index] = 0;
    }
    for (index = 0; index < 13; ++index) {
        GameBoard.pceNum[index] = 0;
    }
    //main logic loop
    for (index = 0; index < 64; ++index) {
        sq = SQ120(index);
        piece = GameBoard.pieces[sq];
        if (piece != PIECES.EMPTY) {
            // console.log('piece  ' + piece + ' on  ' + sq);
            colour = PieceCol[piece];
            GameBoard.material[colour] += PieceVal[piece];
            GameBoard.pList[PCEINDEX(piece, GameBoard.pceNum[piece])] = sq;
            GameBoard.pceNum[piece]++;
        }
    }
    PrintPieceLists();
}


export function ResetBoard() {

    let index = 0;
    for (index = 0; index < BRD_SQ_NUM; ++index) {
        GameBoard.pieces[index] = SQUARES.OFFBOARD;
    }
    for (index = 0; index < 64; ++index) {
        GameBoard.pieces[SQ120(index)] = PIECES.EMPTY;
    }

    //Setting Values
    GameBoard.side = COLOURS.BOTH;
    GameBoard.enPas = SQUARES.NO_SQ;
    GameBoard.fiftyMove = 0;
    GameBoard.ply = 0;
    GameBoard.hisPly = 0;
    GameBoard.CastlePerm = 0;
    GameBoard.posKey = 0;
    GameBoard.moveListStart[GameBoard.ply] = 0;

};



export function ParseFen(fen) {
    ResetBoard();

    let rank = RANKS.RANK_8;
    let file = FILES.FILE_A;
    let piece = 0;
    let count = 0;
    let i = 0;
    let sq120 = 0;
    let fenCnt = 0; // fen[fenCnt]

    while ((rank >= RANKS.RANK_1) && (fenCnt < fen.length)) {
        count = 1;
        switch (fen[fenCnt]) {

            case 'p':
                piece = PIECES.bP;
                break;
            case 'r':
                piece = PIECES.bR;
                break;
            case 'n':
                piece = PIECES.bN;
                break;
            case 'b':
                piece = PIECES.bB;
                break;
            case 'k':
                piece = PIECES.bK;
                break;
            case 'q':
                piece = PIECES.bQ;
                break;
            case 'P':
                piece = PIECES.wP;
                break;
            case 'R':
                piece = PIECES.wR;
                break;
            case 'N':
                piece = PIECES.wN;
                break;
            case 'B':
                piece = PIECES.wB;
                break;
            case 'K':
                piece = PIECES.wK;
                break;
            case 'Q':
                piece = PIECES.wQ;
                break;

            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
                piece = PIECES.EMPTY;
                count = fen[fenCnt].charCodeAt() - '0'.charCodeAt();
                break;
            case '/':
            case ' ':
                rank--;
                file = FILES.FILE_A;
                fenCnt++;
                continue;
            default:
                console.log('FEN Error');
                return;
        }
        for (i = 0; i < count; i++) {
            sq120 = FR2SQ(file, rank);
            GameBoard.pieces[sq120] = piece;
            file++; //only place that file increments inside this function 
        }
        fenCnt++;
        //fenCnt incrememts and the switch starts again

    } //While Loop End
    // rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1

    GameBoard.side = (fen[fenCnt] == 'w') ? COLOURS.WHITE : COLOURS.BLACK;
    fenCnt += 2;

    for (i = 0; i < 4; i++) {
        if (fen[fenCnt] == ' ') {
            break;
        }

        switch (fen[fenCnt]) {
            case 'K':
                GameBoard.CastlePerm |= CASTLEBIT.WKCA;
                break;
            case 'Q':
                GameBoard.CastlePerm |= CASTLEBIT.WQCA;
                break;
            case 'k':
                GameBoard.CastlePerm |= CASTLEBIT.BKCA;
                break;
            case 'q':
                GameBoard.CastlePerm |= CASTLEBIT.BQCA;
                break;
            default:
                break;
        }
        fenCnt++;


    }
    fenCnt++;
    console.log(file, rank, fenCnt, fen, fen[fenCnt]);

    if (fen[fenCnt] != '-') {
        let num1 = fen[fenCnt].charCodeAt();
        let num2 = 'a'.charCodeAt();
        let num3 = fen[fenCnt + 1].charCodeAt();
        let num4 = '0'.charCodeAt();
        file = num1 - num2;
        rank = num3 - num4;

        console.log(' fen[fenCnt]: ' + fen[fenCnt] + " File: " + file + ' Rank: ' + rank);
        GameBoard.enPas = FR2SQ(file, rank);
    }

    GameBoard.posKey = GeneratePosKey();
    UpdateListsMaterial();
    // PrintSqAttacked();

}
// Printing the Square Attacked
//Useless Functions
function PrintSqAttacked() {
    let sq, file, rank, piece;
    console.log('\n Attacked: \n');
    for (rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank++) {
        let line = ((rank + 1) + " ");
        for (file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
            sq = FR2SQ(file, rank);
            if (SqAttacked(sq, GameBoard.side) == BOOL.TRUE) piece = "X";
            else piece = "-";
            line += (" " + piece + " ");
        }
        console.log(line);
    }
    console.log('');
}

export function SqAttacked(sq, side) {
    let pce, t_sq, index;
    if (side == COLOURS.WHITE) {
        if (GameBoard.pieces[sq - 11] == PIECES.wP || GameBoard.pieces[sq - 9] == PIECES.wP) {
            return BOOL.TRUE;
        }
    } else {
        if (GameBoard.pieces[sq + 11] == PIECES.bP || GameBoard.pieces[sq + 9] == PIECES.bP) {
            return BOOL.FALSE;
        }

    }
    //for non sliding pieces
    //For Knight , 8 indexes or base points of attack
    for (index = 0; index < 8; index++) {
        pce = GameBoard.pieces[sq + KnDir[index]];
        if (pce != SQUARES.OFFBOARD && PieceCol[pce] == side && PieceKnight[pce] == BOOL.TRUE) {
            return BOOL.TRUE;
        }
    }
    //for Sliding Pieces

    // FOR ROOKS 

    for (index = 0; index < 4; ++index) {
        let dir = RkDir[index];
        t_sq = sq + dir;
        pce = GameBoard.pieces[t_sq];
        while (pce != SQUARES.OFFBOARD) {
            if (pce != PIECES.EMPTY) {
                if (PieceRookQueen[pce] == BOOL.TRUE && PieceCol[pce] == side) {
                    return BOOL.TRUE;
                }
                break;
            }
            t_sq += dir;
            pce = GameBoard.pieces[t_sq];

        }
    }
    //For Bishops
    for (index = 0; index < 4; ++index) {
        let dir = BiDir[index];
        t_sq = sq + dir;
        pce = GameBoard.pieces[t_sq];
        while (pce != SQUARES.OFFBOARD) {
            if (pce != PIECES.EMPTY) {
                if (PieceBishopQueen[pce] == BOOL.TRUE && PieceCol[pce] == side) {
                    return BOOL.TRUE;
                }
                break;
            }
            t_sq += dir;
            pce = GameBoard.pieces[t_sq];

        }
    }
    //For KING
    for (index = 0; index < 8; index++) {
        pce = GameBoard.pieces[sq + KiDir[index]];
        if (pce != SQUARES.OFFBOARD && PieceCol[pce] == side && PieceKing[pce] == BOOL.TRUE) {
            return BOOL.TRUE;
        }
    }
    return BOOL.FALSE;

}