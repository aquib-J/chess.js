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
    CheckBoard

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
    START_FEN,
    MAXGAMEMOVES,
    GameBoard,
    NOMOVE,
    SideKey,
    PVENTRIES,


} from './defs.js';
import {
    GenerateMoves
} from './movegen.js';
import {
    PrintMoveList
} from './io.js';
import {
    PerftTest
} from './perft.js';
import {
    NewGame
} from './gui.js';




// Plain js for dom manipulation
function setUpValues() {
    console.log('DOM is ready');
    InitFilesRanksBrd();
    console.log('files & ranks boards initialized');
    InitHashKeys();
    console.log('hash keys set');
    InitSq120To64();
    console.log('function for swapping 64-120 initialized');
    InitBoardVars();
    //Sets the CHECK pattern / board colour
    InitBoardSquares();
    NewGame(START_FEN);

    // ParseFen(START_FEN);
    // console.log('ParseFen called with the preset fen string');
    // PrintBoard();
    // console.log('congrats finally trouble shooted, board is printed');
    // PerftTest(2);
    // GenerateMoves();
    // PrintMoveList();
    // //Integrity of the Board is intact if CheckBoard doesnt generate any errors
    // CheckBoard();
}



document.addEventListener('DOMContentLoaded', setUpValues);





// intitializes both the files-120 squares and the ranks-120 squares
//the first loops, sets all the squares to =100(OFFBOARD), 2nd loop fills it 
//with 21-28,31-38,81-88,91-98 and the inner boards with their numbers resp 

function InitFilesRanksBrd() {
    var index = 0;
    var file = FILES.FILE_A;
    var rank = RANKS.RANK_1;
    var sq = SQUARES.A1;
    for (index = 0; index < BRD_SQ_NUM; ++index) {
        FilesBrd[index] = SQUARES.OFFBOARD;
        RanksBrd[index] = SQUARES.OFFBOARD;
    }

    for (rank = RANKS.RANK_1; rank <= RANKS.RANK_8; ++rank) {
        for (file = FILES.FILE_A; file <= FILES.FILE_H; ++file) {
            sq = FR2SQ(file, rank);
            FilesBrd[sq] = file;
            RanksBrd[sq] = rank;
        }
    }

    // console.log("FileBoard[0]:" + FilesBrd[0] + "RanksBoard[0]:" + RanksBrd[0]);


}

// Chain of Exor generating the unique posKey
function InitHashKeys() {
    var index = 0;
    for (index = 0; index < 14 * 120; ++index) {
        PieceKeys[index] = RAND_32();
    }
    window.SideKey = RAND_32();
    for (index = 0; index < 16; ++index) {
        CastleKeys[index] = RAND_32();
    }

}

function InitSq120To64() {

    var index = 0;
    var file = FILES.FILE_A;
    var rank = RANKS.RANK_1;
    var sq = SQUARES.A1;
    var sq64 = 0;

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

function InitBoardVars() {
    var index = 0;
    for (index = 0; index < MAXGAMEMOVES; ++index) {
        GameBoard.history.push({
            move: NOMOVE,
            castlePerm: 0,
            enPas: 0,
            fiftyMove: 0,
            posKey: 0
        });
    }

    for (index = 0; index < PVENTRIES; ++index) {
        GameBoard.PvTable.push({
            move: NOMOVE,
            posKey: 0
        });
    }
}

//Gui set up function // Use the CSS variables to print the board colour
function InitBoardSquares() {

    var light = 1;
    var rankName;
    var fileName;

    var rankIter;
    var fileIter;
    var lightString;
    for (rankIter = RANKS.RANK_8; rankIter >= RANKS.RANK_1; rankIter--) {
        light ^= 1;
        rankName = "rank" + (rankIter + 1);
        for (fileIter = FILES.FILE_A; fileIter <= FILES.FILE_H; ++fileIter) {
            fileName = "file" + (fileIter + 1);
            if (light == 0) lightString = "Light";
            else lightString = "Dark";
            light ^= 1;

            let classstring = `Square ${rankName} ${fileName} ${lightString}`;

            let child_div = document.createElement('div');
            child_div.setAttribute("class", classstring);
            document.querySelector("#Board").appendChild(child_div);
        }

    }
}