"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Revavroomex = void 0;
const game_1 = require("../../game");
class Revavroomex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.METAL;
        this.hp = 280;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.resistance = [{ type: game_1.CardType.GRASS, value: -30 }];
        this.powers = [
            {
                name: 'Tune-Up',
                powerType: game_1.PowerType.ABILITY,
                text: 'This Pokémon may have up to 4 Pokémon Tools attached to it. If it loses this Ability, discard Pokémon Tools from it until only 1 remains.'
            }
        ];
        this.attacks = [
            {
                name: 'Wild Drift',
                cost: [game_1.CardType.METAL, game_1.CardType.METAL, game_1.CardType.COLORLESS],
                damage: 170,
                text: 'During your opponent\'s next turn, this Pokémon takes 30 less damage from attacks (after applying Weakness and Resistance).'
            }
        ];
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '156';
        this.name = 'Revavroom ex';
        this.fullName = 'Revavroom ex OBF';
    }
}
exports.Revavroomex = Revavroomex;
