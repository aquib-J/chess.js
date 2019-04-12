import {
    GameBoard
} from './defs.js'

function MOVE(from, to, captured, promoted, flag) {
    return (from | (to << 7) | (captured << 14) | (promoted << 20) | flag);
}


function GenerateMoves() {

    GameBoard.moveListStart[GameBoard.ply + 1] = GameBoard.moveListStart[GameBoard.ply];

    let pceType, pceNum, sq;


}