 var PIECES = {
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


 var BRD_SQ_NUM = 120;

 var FILES = {
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
 var RANKS = {
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

 var COLOURS = {
     WHITE: 0,
     BLACK: 1,
     BOTH: 2
 };
 var CASTLEBIT = {
     WKCA: 1,
     WQCA: 2,
     BKCA: 4,
     BQCA: 8
 };

 var SQUARES = {
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

 var BOOL = {
     FALSE: 0,
     TRUE: 1
 };
 // values set before GAME Board Reset / FEN definition function is implemented


 var MAXGAMEMOVES = 2048;
 var MAXPOSITIONMOVES = 256;
 var MAXDEPTH = 64;




 var FilesBrd = new Array(BRD_SQ_NUM);
 var RanksBrd = new Array(BRD_SQ_NUM);


 //set Initial position
 var START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - KQkq 0 0';

 var PceChar = '.PNBRQKpnbrqk';
 var SideChar = 'wb-';
 var RankChar = '12345678';
 var FileChar = 'abcdefgh';


 function FR2SQ(f, r) {
     return (((f) + 21) + ((r) * 10));
 }
 //Empty:0 W(P N B R Q K) B(P N B R Q K)
 //all except pawn
 var PieceBig = [BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE];
 //only Rook, Queen, King
 var PieceMaj = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE];
 //only Knight Bishop
 var PieceMin = [BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE];
 var PieceVal = [0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000];
 var PieceCol = [COLOURS.BOTH, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE,
     COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK
 ];

 var PiecePawn = [BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE];
 var PieceKnight = [BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE];
 var PieceKing = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE];
 var PieceRookQueen = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE];
 var PieceBishopQueen = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE];
 var PieceSlides = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE];

 //defined for AttackedSquares
 var KnDir = [-8, -19, -21, -12, 8, 19, 21, 12];
 var RkDir = [-1, -10, 1, 10];
 var BiDir = [-9, -11, 11, 9];
 var KiDir = [-1, -10, 1, 10, -9, -11, 11, 9];
 var DirNum = [0, 0, 8, 4, 4, 8, 8, 0, 8, 4, 4, 8, 8]; // no of direction by piecetype. NIght has 8 direction, King and queen have 8 dir each
 var PceDir = [0, 0, KnDir, BiDir, RkDir, KiDir, KiDir, 0, KnDir, BiDir, RkDir, KiDir, KiDir];
 var LoopNonSlidePce = [PIECES.wN, PIECES.wK, 0, PIECES.bN, PIECES.bK, 0];
 var LoopNonSlideIndex = [0, 3];

 var LoopSlidePce = [PIECES.wB, PIECES.wR, PIECES.wQ, 0, PIECES.bB, PIECES.bR, PIECES.bQ, 0];
 var LoopSlideIndex = [0, 4];

 //Keys for EXOR ing
 var PieceKeys = new Array(14 * 120);
 var SideKey;
 var CastleKeys = new Array(16);

 var Sq120toSq64 = new Array(BRD_SQ_NUM);
 var Sq64toSq120 = new Array(64);


 function RAND_32() {
     return (Math.floor((Math.random() * 255) + 1) << 23) | (Math.floor((Math.random() * 255) + 1) << 16) | (Math.floor((Math.random() * 255) + 1) << 8) | Math.floor((Math.random() * 255) + 1);
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

 var Kings = [PIECES.wK, PIECES.bK];
 var CastlePerm = [
     15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
     15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
     15, 13, 15, 15, 15, 12, 15, 15, 14, 15,
     15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
     15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
     15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
     15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
     15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
     15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
     15, 7, 15, 15, 15, 3, 15, 15, 11, 15,
     15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
     15, 15, 15, 15, 15, 15, 15, 15, 15, 15
 ];
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


 var MFLAGEP = 0x40000;
 var MFLAGPS = 0x80000;
 var MFLAGCA = 0x1000000;


 //for quick comparision
 var MFLAGCAP = 0x7C; // captured + enpassant
 var MFLAGPROM = 0xF00000;

 var NOMOVE = 0;


 function SQOFFBOARD(sq) {
     if (FilesBrd[sq] == SQUARES.OFFBOARD) return BOOL.TRUE;
     return BOOL.FALSE;
 }

 // utility functions for the Gen Pos key() Hashing Function
 function HASH_PCE(pce, sq) {
     GameBoard.posKey ^= PieceKeys[(pce * 120) + sq];
 }

 function HASH_CA() {
     GameBoard.posKey ^= CastleKeys[GameBoard.CastlePerm];
 }

 function HASH_SIDE() {
     GameBoard.posKey ^= SideKey;
 }

 function HASH_EP() {
     GameBoard.posKey ^= PieceKeys[GameBoard.enPas];

 }





 var GameBoard = {};


 GameBoard.pieces = new Array(BRD_SQ_NUM);
 GameBoard.side = COLOURS.WHITE;
 GameBoard.fiftyMove = 0;
 //hisply is fullmoves
 GameBoard.hisPly = 0;
 GameBoard.history = [];
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
     MAXGAMEMOVES,
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
     SQOFFBOARD,

     DirNum,
     PceDir,
     LoopNonSlidePce,
     LoopNonSlideIndex,
     LoopSlidePce,
     LoopSlideIndex,
     MFLAGEP,
     MFLAGPS,
     MFLAGCA,

     MFLAGCAP,
     MFLAGPROM,

     NOMOVE,
     FROMSQ,
     CAPTURED,
     TOSQ,
     PROMOTED,

 }