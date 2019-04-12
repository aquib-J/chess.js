 let PIECES = {
     EMPTY: 0,
     wP: 1,
     wN: 2,
     wB: 3,
     wR: 4,
     wQ: 5,
     wK: 6,
     bP: 7,
     bN: 8,
     bB: 9,
     bR: 10,
     bQ: 11,
     bK: 12
 };


 let BRD_SQ_NUM = 120;

 let FILES = {
     FILE_A: 0,
     FILE_B: 1,
     FILE_C: 2,
     FILE_D: 3,
     FILE_E: 4,
     FILE_F: 5,
     FILE_G: 6,
     FILE_H: 7,
     FILE_NONE: 8
 };
 let RANKS = {
     RANK_1: 0,
     RANK_2: 1,
     RANK_3: 2,
     RANK_4: 3,
     RANK_5: 4,
     RANK_6: 5,
     RANK_7: 6,
     RANK_8: 7,
     RANK_NONE: 8
 };

 let COLOURS = {
     WHITE: 0,
     BLACK: 1,
     BOTH: 3
 };
 let CASTLEBIT = {
     WKCA: 1,
     WQCA: 2,
     BKCA: 4,
     BQCA: 8
 };

 let SQUARES = {
     A1: 21,
     B1: 22,
     C1: 23,
     D1: 24,
     E1: 25,
     F1: 26,
     G1: 27,
     H1: 28,
     A8: 91,
     B8: 92,
     C8: 93,
     D8: 94,
     E8: 95,
     F8: 96,
     G8: 97,
     H8: 98,
     NO_SQ: 99,
     OFFBOARD: 100
 };

 let BOOL = {
     FALSE: 0,
     TRUE: 1
 };
 // values set before GAME Board Reset / FEN definition function is implemented


 let MAXGAMEMOVES = 2048;
 let MAXPOSITIONMOVES = 256;
 let MAXDEPTH = 64;




 let FilesBrd = new Array(BRD_SQ_NUM);
 let RanksBrd = new Array(BRD_SQ_NUM);


 //set Initial position
 let START_FEN = 'r1bqkb1r/pppn1ppp/4pn2/3p4/2PP4/2N1PN2/PP3PPP/R1BQKB1R b - KQkq 0 4';

 let PceChar = '.PNBRQKpnbrqk';
 let SideChar = 'wb-';
 let RankChar = '12345678';
 let FileChar = 'abcdefgh';


 function FR2SQ(f, r) {
     return ((f + 21) + ((r) * 10));
 }
 //Empty:0 W(P N B R Q K) B(P N B R Q K)
 //all except pawn
 let PieceBig = [BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE];
 //only Rook, Queen, King
 let PieceMaj = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE];
 //only Knight Bishop
 let PieceMin = [BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE];
 let PieceVal = [0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000];
 let PieceCol = [COLOURS.BOTH, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE,
     COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK
 ];

 let PiecePawn = [BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE];
 let PieceKnight = [BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE];
 let PieceKing = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE];
 let PieceRookQueen = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE];
 let PieceBishopQueen = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE];
 let PieceSlides = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE];

 //defined for AttackedSquares
 let KnDir = [-8, -19, -21, -12, 8, 19, 21, 12];
 let RkDir = [-1, -10, 1, 10];
 let BiDir = [-9, -11, 11, 9];
 let KiDir = [-1, -10, 1, 10, -9, -11, 11, 9];



 //Keys for EXOR ing
 let PieceKeys = new Array(14 * 120);
 let SideKey;
 let CastleKeys = new Array(16);

 let Sq120toSq64 = new Array(BRD_SQ_NUM);
 let Sq64toSq120 = new Array(64);


 function RAND_32() {
     return (Math.floor((Math.random() * 255) + 1) << 23) | (Math.floor((Math.random() * 255) + 1) << 23) | (Math.floor((Math.random() * 255) + 1) << 23) | Math.floor((Math.random() * 255) + 1);
 }

 function SQ64(sq120) {
     return Sq120toSq64[(sq120)];
 }

 function SQ120(sq64) {
     return Sq64toSq120[(sq64)];
 }
 // Piece List Indexing
 function PCEINDEX(pce, pceNum) {
     return (pce * 10 + pceNum);
 }
 //Movegen 28 bit binary sequence keeping track of things
 /* 
    0000 0000 0000 0000 0000 0111 1111 -> From 0x7F
    0000 0000 0000 0011 1111 1000 0000 -> To >> 7, 0x7F
    0000 0000 0011 1100 0000 0000 0000 -> Captured >>14, 0xF
    0000 0000 0100 0000 0000 0000 0000 -> EnPassant ( & 0x40000)
    0000 0000 1000 0000 0000 0000 0000 -> Pawn Start ( & 0x80000)
    0000 1111 0000 0000 0000 0000 0000 -> Promoted Piece >>20, 0xF
    0001 0000 0000 0000 0000 0000 0000 -> Castle (& 0x1000000)
 */


 function FROMSQ(m) {
     return (m & 0x7F);
 }

 function TOSQ(m) {
     return ((m >> 7) & 0x7F);
 }

 function CAPTURED(m) {
     return ((m >> 14) & 0xF);
 }

 function PROMOTED(m) {
     return ((m >> 20) & 0xF);
 }


 let MFLAGEP = 0x40000;
 let MFLAGPS = 0x80000;
 let MFLAGCA = 0x1000000;


 //for quick comparision
 let MFLAGCAP = 0x7C; // captured + enpassant
 let MFLAGPROM = 0xF00000;

 let NOMOVE = 0;







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

 export {
     GameBoard,
     SQ120,
     SQ64,
     BRD_SQ_NUM,
     COLOURS,
     MAXDEPTH,
     MAXPOSITIONMOVES,
     SQUARES,
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
     PCEINDEX,
     RAND_32,
     PieceCol,
     PieceVal,
     FilesBrd,
     RanksBrd,
     BOOL,
     Sq120toSq64,
     Sq64toSq120,
     START_FEN,
     KnDir,
     RkDir,
     BiDir,
     KiDir,
     PiecePawn,
     PieceKnight,
     PieceKing,
     PieceRookQueen,
     PieceBishopQueen,
     PieceSlides,
     PieceBig,
     PieceMaj,
     PieceMin,

 };