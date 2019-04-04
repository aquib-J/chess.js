// import {
//     *
// } from './defs'
import {
    BRD_SQ_NUM,
    COLOURS,
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
    CASTLEBIT
} from './defs.js';
let GameBoard = {};


GameBoard.pieces = new Array(BRD_SQ_NUM);
GameBoard.side = COLOURS.WHITE;
GameBoard.fiftyMove = 0;
//hisply is fullmoves
GameBoard.hisPly = 0;
//ply is half moves
GameBoard.ply = 0;
GameBoard.enPas = 0; //en passant
GameBoard.CastlePerm = 0;
GameBoard.material = new Array(2); //WHITE,BLACK MATERIAL OF PIECES

GameBoard.pceNum = new Array(13); //how many of each piece-type we have; indexed by piece
GameBoard.pList = new Array(14 * 10);
//Piece List, keeps all the pieces 13 * 10 potential pieces of each type
//stored in pceNum (wN*10 + 0,1,..9) 10-19, 

/*
loop(pieces[])
if(piece on square==side to move)
    then genmoves() for piece on sq
*/
GameBoard.posKey = 0;
/* Position Key -> a unique number representing position of the game board
used bit wise ExOr
    Rand_32() generates the 31 bit key
*/
GameBoard.moveList = new Array(MAXDEPTH * MAXPOSITIONMOVES);
GameBoard.moveScores = new Array(MAXDEPTH * MAXPOSITIONMOVES);
GameBoard.moveListStart = new Array(MAXDEPTH);

export function PrintBoard() {
    let sq, file, rank, piece;
    console.log('\nGame Board:\n');
    for (rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank--) {
        let line = (RankChar[rank] + ' ');
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
        if (piece !== PIECES.EMPTY && piece !== SQUARES.OFFBOARD) {
            finalKey ^= PieceKeys[(piece * 120) + sq];
        }
    }

    if (GameBoard.side == COLOURS.WHITE) {
        finalKey ^= SideKey;
    }

    if (GameBoard.enPas !== SQUARES.NO_SQ) {
        finalKey ^= PieceKeys[GameBoard.enPas];
    }

    finalKey ^= CastleKeys[GameBoard.CastlePerm];

    return finalKey;
};


export function ResetBoard() {

    let index = 0;
    for (index = 0; index < BRD_SQ_NUM; ++index) {
        GameBoard.pieces[index] = SQUARES.OFFBOARD;
    }
    for (index = 0; index < 64; ++index) {
        GameBoard.pieces[SQ120(index)] = PIECES.EMPTY;
    }
    for (index = 0; index < 14 * 120; ++index) {
        GameBoard.pList[index] = PIECES.EMPTY;
    }
    for (index = 0; index < 2; ++index) {
        GameBoard.material[index] = 0;
    }
    for (index = 0; index < 13; ++index) {
        GameBoard.pceNum[index] = 0;
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

    while ((rank >= RANKS.RANK_1) && fenCnt < fen.length) {
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
    // rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1

    GameBoard.side = (fen[fenCnt] === 'w') ? COLOURS.WHITE : COLOURS.BLACK;
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

    if (fen[fenCnt] !== '-') {
        file = fen[fenCnt].charCodeAt() - 'a'.charCodeAt();
        rank = fen[fenCnt + 1].charCodeAt() - '0'.charCodeAt();
        console.log('fen[fenCnt]:' + fen[fenCnt] + "File:" + file + 'Rank:' + rank);
        GameBoard.enPas = FR2SQ(file, rank);
    }

    GameBoard.posKey = GeneratePosKey();

}