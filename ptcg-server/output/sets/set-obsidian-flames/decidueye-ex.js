"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decidueyeex = void 0;
const game_1 = require("../../game");
class Decidueyeex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.cardType = game_1.CardType.GRASS;
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Dartrix';
        this.hp = 320;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.powers = [
            {
                name: 'Total Freedom',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may use this Ability. If this Pokémon is on the Bench, switch it with your Active Pokémon. Or, if this Pokémon is in the Active Spot, switch it with 1 of your Benched Pokémon.'
            }
        ];
        this.attacks = [
            {
                name: 'Hunting Arrow',
                cost: [game_1.CardType.GRASS, game_1.CardType.COLORLESS],
                damage: 130,
                text: 'This attack also does 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'SET';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '16';
        this.name = 'Decidueye rc';
        this.fullName = 'Decidueye ex OBF';
    }
}
exports.Decidueyeex = Decidueyeex;
