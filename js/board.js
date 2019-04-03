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

function GeneratePosKey() {

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
}