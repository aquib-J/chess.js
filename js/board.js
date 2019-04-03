let GameBoard = {};


GameBoard.pieces = new Array(BRD_SQ_NUM);
GameBoard.side = COLOURS.WHITE;
GameBoard.fiftyMove = 0;
//hisply is fullmoves
GameBoard.hisPly = 0;
//ply is half moves
GameBoard.ply = 0;

GameBoard.CastlePerm = 0;
GameBoard.material = new Array(2); //WHITE,BLACK MATERIAL OF PIECES