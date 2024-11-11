"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudewArt = exports.BlazikenexArt = exports.CombuskenArt = exports.TorchicArt = exports.LilliesClefairyexArt = void 0;
const blaziken_ex_1 = require("./blaziken-ex");
const budew_1 = require("./budew");
const combusken_1 = require("./combusken");
const lillies_clefairy_ex_1 = require("./lillies-clefairy-ex");
const torchic_1 = require("./torchic");
class LilliesClefairyexArt extends lillies_clefairy_ex_1.LilliesClefairyex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i.imgur.com/QhiYThD.png';
    }
}
exports.LilliesClefairyexArt = LilliesClefairyexArt;
class TorchicArt extends torchic_1.Torchic {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://www.pokebeach.com/news/2024/10/modal-decklist-3-card-1-1.png';
    }
}
exports.TorchicArt = TorchicArt;
class CombuskenArt extends combusken_1.Combusken {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://www.pokebeach.com/news/2024/10/modal-decklist-3-card-2-1.png';
    }
}
exports.CombuskenArt = CombuskenArt;
class BlazikenexArt extends blaziken_ex_1.Blazikenex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://www.pokebeach.com/news/2024/10/modal-deck-3-card-2.png';
    }
}
exports.BlazikenexArt = BlazikenexArt;
class BudewArt extends budew_1.Budew {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://www.pokebeach.com/news/2024/11/Budew.png';
    }
}
exports.BudewArt = BudewArt;
