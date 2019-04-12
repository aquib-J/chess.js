import {
    ParseFen,
    PrintBoard,

} from './board.js';
import {
    GameBoard
} from './defs.js'
// import {
//     FILES,
//     RANKS,
//     SQUARES,
//     BRD_SQ_NUM,
//     FilesBrd,
//     RanksBrd,
//     FR2SQ,
//     PieceKeys,
//     RAND_32,
//     CastleKeys,
//     Sq120toSq64,
//     Sq64toSq120,
//     START_FEN

// } from './defs.js';



document.querySelector("#SetFen").addEventListener('click', (e) => {

    let fenstr = document.querySelector("#fenIn").value;

    console.log(`${fenstr}`);
    ParseFen(fenstr);
    PrintBoard();
    console.log('event working');
    console.log(GameBoard);

});

//JQUERY CODE
// $('#SetFen').click(function () {
//     var fenstr = $('#fenIn').val();
//     ParseFen(fenstr);
//     PrintBoard();
// });