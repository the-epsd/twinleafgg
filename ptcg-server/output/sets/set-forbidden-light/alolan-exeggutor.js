"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlolanExeggutor = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class AlolanExeggutor extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Exeggcute';
        this.cardType = G;
        this.hp = 160;
        this.weakness = [{ type: R }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Tropical Shake',
                cost: [G],
                damage: 20,
                text: 'This attack does 20 more damage for each type of Basic Energy card in your discard pile. ' +
                    'You can\'t add more than 100 damage in this way.'
            },
        ];
        this.set = 'FLI';
        this.setNumber = '2';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Alolan Exeggutor';
        this.fullName = 'Alolan Exeggutor FLI';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const energyTypes = [];
            player.discard.cards.forEach(c => {
                if ((c instanceof game_1.EnergyCard) && (c.energyType == card_types_1.EnergyType.BASIC)) {
                    for (const et of c.provides) {
                        if (!energyTypes.includes(et)) {
                            energyTypes.push(et);
                        }
                    }
                }
            });
            effect.damage += Math.min(energyTypes.length * 20, 100);
        }
        return state;
    }
}
exports.AlolanExeggutor = AlolanExeggutor;
