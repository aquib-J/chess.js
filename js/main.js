$(function () {
    init();
    console.log('main init called');
});

// intitializes both the files-120 squares and the ranks-120 squares
//the first loops, sets all the squares to =100(OFFBOARD), 2nd loop fills it 
//with 0-7 respectively

function InitFilesRanksBrd() {
    let index = 0;
    let file = FILES.FILE_A;
    let rank = RANKS.RANK_1;
    let sq = SQUARES.A1;
    for (index = 0; index < BRD_SQ_NUM; index++) {
        FilesBrd[index] = SQUARES.OFFBOARD;
        RanksBrd[index] = SQUARES.OFFBOARD;
    }

    for (rank; rank <= RANKS.RANK_8; rank++) {
        for (file; file <= FILES.FILE_H; file++) {
            sq = FR2SQ(file, rank);
            FilesBrd[sq] = file;
            RanksBrd[sq] = rank;
        }
    }

    // console.log("FileBoard[0]:" + FilesBrd[0] + "RanksBoard[0]:" + RanksBrd[0]);


}

// Chain of Exor generating the unique posKey
function InitHashKeys() {
    let index = 0;
    for (index = 0; index < 14 * 120; ++index) {
        PieceKeys[index] = RAND_32();
    }
    SideKey = RAND_32();
    for (index = 0; index < 16; ++index) {
        CastleKeys[index] = RAND_32();
    }

}



function init() {
    console.log("init() called");
    InitFilesRanksBrd();
    InitHashKeys();

}