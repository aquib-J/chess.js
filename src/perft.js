import {
    GenerateMoves
} from './movegen.js';
import {
    GeneratePosKey,
    PrintBoard
} from './board.js';
import {
    MakeMove,
    TakeMove
} from './makemove.js';
import {
    GameBoard,
    BOOL
} from './defs.js';
import {
    PrMove
} from './io.js';

var perft_leafNodes;

export function Perft(depth) {
    if (depth == 0) {
        perft_leafNodes++;
        return;
    }
    GenerateMoves();
    var index;
    var move;
    for (index = GameBoard.moveListStart[GameBoard.ply]; index < GameBoard.moveListStart[GameBoard.ply + 1]; ++index) {
        move = GameBoard.moveList[index];
        if (MakeMove(move) == BOOL.FALSE) {
            continue;
        }
        Perft(depth - 1);
        TakeMove();
    }
    return;
}

export function PerftTest(depth) {
    PrintBoard();
    console.log('starting Test to Depth:' + depth);
    perft_leafNodes = 0;
    var index;
    var move;
    var moveNum = 0;
    for (index = GameBoard.moveListStart[GameBoard.ply]; index < GameBoard.moveListStart[GameBoard.ply + 1]; ++index) {
        move = GameBoard.moveList[index];
        if (MakeMove(move) == BOOL.FALSE) {
            continue;
        }
        moveNum++;
        var cumnodes = perft_leafNodes;
        Perft(depth - 1);
        TakeMove();
        var oldnodes = perft_leafNodes - cumnodes;
        console.log("move:" + moveNum + " " + PrMove(move) + " " + oldnodes);
    }
    console.log("test complete: " + perft_leafNodes + " leaf Nodes Visited");
    return;
}