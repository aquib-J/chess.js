// Jquery shit , trying to use plain js dom manipulations for basic works
// $(function () {
//     init();
//     console.log('main init called');

//     ParseFen(START_FEN);
//     PrintBoard();
// });
// function init() {
//     console.log("init() called");
//     InitFilesRanksBrd();
//     InitHashKeys();

// }

import {
    PrintBoard,
    ParseFen,

}
from './board.js';
import {
    FILES,
    RANKS,
    SQUARES,
    BRD_SQ_NUM,
    FilesBrd,
    RanksBrd,
    FR2SQ,
    PieceKeys,
    RAND_32,
    CastleKeys,
    Sq120toSq64,
    Sq64toSq120,
    START_FEN

} from './defs.js';





// Plain js for dom manipulation
function setUpValues() {
    console.log('DOM is ready');
    InitFilesRanksBrd();
    console.log('files & ranks boards initialized');
    InitHashKeys();
    console.log('hash keys set');
    InitSq120To64();
    console.log('function for swapping 64-120 initialized');
    ParseFen(START_FEN);
    console.log('ParseFen called with the preset fen string');
    PrintBoard();
    console.log('congrats finally trouble shooted, board is printed');
}



document.addEventListener('DOMContentLoaded', setUpValues);




document.getElementById('SetFen').addEventListener('onClick', (e) => {
    let fenstr = document.getElementById('fenIn').value;
    console.log(`${fenstr}`);
    ParseFen(fenstr);
    PrintBoard();
    console.log('event working');

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
    let SideKey = RAND_32();
    for (index = 0; index < 16; ++index) {
        CastleKeys[index] = RAND_32();
    }

}

function InitSq120To64() {

    let index = 0;
    let file = FILES.FILE_A;
    let rank = RANKS.RANK_1;
    let sq = SQUARES.A1;
    let sq64 = 0;

    //Reset all the 120 squares to the value 65
    for (index = 0; index < BRD_SQ_NUM; index++) {
        Sq120toSq64[index] = 65;
    }
    //Reset all the 64 squares to the value 120  
    for (index = 0; index < 64; index++) {
        Sq64toSq120[index] = 120;
    }

    for (rank = RANKS.RANK_1; rank <= RANKS.RANK_8; ++rank) {
        for (file = FILES.FILE_A; file <= FILES.FILE_H; ++file) {
            sq = FR2SQ(file, rank);
            Sq64toSq120[sq64] = sq;
            Sq120toSq64[sq] = sq64;
            sq64++;
        }
    }




}