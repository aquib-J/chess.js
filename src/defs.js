export let PIECES = {
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


export let BRD_SQ_NUM = 120;

export let FILES = {
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
export let RANKS = {
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

export let COLOURS = {
    WHITE: 0,
    BLACK: 1,
    BOTH: 3
};
export let CASTLEBIT = {
    WKCA: 1,
    WQCA: 2,
    BKCA: 4,
    BQCA: 8
};

export let SQUARES = {
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

export let BOOL = {
    FALSE: 0,
    TRUE: 1
};
// values set before GAME Board Reset / FEN definition function is implemented


export let MAXGAMEMOVES = 2048;
export let MAXPOSITIONMOVES = 256;
export let MAXDEPTH = 64;




export let FilesBrd = new Array(BRD_SQ_NUM);
export let RanksBrd = new Array(BRD_SQ_NUM);


//set Initial position
export let START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - KQkq - 0 1';

export let PceChar = '.PNBRQKpnbrqk';
export let SideChar = 'wb-';
export let RankChar = '12345678';
export let FileChar = 'abcdefgh';


export function FR2SQ(f, r) {
    return ((f + 21) + ((r) * 10));
}
//Empty:0 W(P N B R Q K) B(P N B R Q K)
//all except pawn
export let PieceBig = [BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE];
//only Rook, Queen, King
export let PieceMaj = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE];
//only Knight Bishop
export let PieceMin = [BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE];
export let PieceVal = [0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000];
export let PieceCol = [COLOURS.BOTH, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE,
    COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK
];

export let PiecePawn = [BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE];
export let PieceKnight = [BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE];
export let PieceKing = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE];
export let PieceRookQueen = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE];
export let PieceBishopQueen = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE];
export let PieceSlides = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE];


//Keys for EXOR ing
export let PieceKeys = new Array(14 * 120);
export let SideKey;
export let CastleKeys = new Array(16);

export let Sq120toSq64 = new Array(BRD_SQ_NUM);
export let Sq64toSq120 = new Array(64);


export function RAND_32() {
    return (Math.floor((Math.random() * 255) + 1) << 23) | (Math.floor((Math.random() * 255) + 1) << 23) | (Math.floor((Math.random() * 255) + 1) << 23) | Math.floor((Math.random() * 255) + 1);
}

export function SQ64(sq120) {
    return Sq120toSq64[(sq120)];
}

export function SQ120(sq64) {
    return Sq64toSq120[(sq64)];
}