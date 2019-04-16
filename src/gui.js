import {
    ParseFen,
    PrintBoard,

} from './board.js';
import {
    GameBoard,
    FilesBrd,
    RanksBrd,
    SQ120,
    PIECES,
    SideChar,
    PieceCol,
    PceChar
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

    var fenstr = document.querySelector("#fenIn").value;

    console.log(`${fenstr}`);
    NewGame(fenstr);

});

export function NewGame(fenstr) {
    ParseFen(fenstr);
    PrintBoard();
    setInitialBoardPieces();
}

function clearAllPieces() {
    var selector = document.querySelector("#Board").getElementsByTagName('img');
    selector.forEach((item) => {
        console.log(item.id)
    });
    console.log(selector);

}

//for setting the Pieces images

function setInitialBoardPieces() {
    var sq, sq120, file, rank, rankName, fileName, image_src, image_classList, pce;
    // clearAllPieces();
    for (sq = 0; sq < 64; ++sq) {
        sq120 = SQ120(sq);
        pce = GameBoard.pieces[sq120];
        file = FilesBrd[sq120];
        rank = RanksBrd[sq120];

        if (pce >= PIECES.wP && pce <= PIECES.bK) {
            rankName = "rank" + (rank + 1);
            fileName = "file" + (file + 1);
            image_src = `./assets/${SideChar[PieceCol[pce]]}${PceChar[pce].toUpperCase()}.png`;
            image_classList = `Piece ${rankName} ${fileName}`;
            let img_node = document.createElement('img');
            img_node.setAttribute("src", image_src);
            img_node.setAttribute("class", image_classList);
            document.querySelector("#Board").appendChild(img_node);
        }


    }
}

//JQUERY CODE
// $('#SetFen').click(function () {
//     var fenstr = $('#fenIn').val();
//     ParseFen(fenstr);
//     PrintBoard();
// });