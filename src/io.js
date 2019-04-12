import {
    FileChar,
    RankChar,
    FilesBrd,
    RanksBrd
} from "./defs.js";


// converting into algebraic notation
export function PrSq(sq) {
    return (FileChar[FilesBrd[sq]] + RankChar[RanksBrd[sq]]);
}