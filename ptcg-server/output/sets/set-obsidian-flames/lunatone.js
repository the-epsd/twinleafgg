"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lunatone = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Lunatone extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'New Moon',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'If you have Solrock in play, prevent all effects of any Stadium ' +
                    'done to your Pokémon in play.'
            }];
        this.attacks = [{
                name: '',
                cost: [],
                damage: 100,
                text: ''
            }];
        this.set = 'OBF';
        this.name = 'Lunatone';
        this.fullName = 'Lunatone OBF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect) {
            const target = effect.player;
            if (this.powers.some(a => a.name === 'New Moon') && target === effect.player) {
                // Ignore stadium effect
                return state;
            }
        }
        return state;
    }
}
exports.Lunatone = Lunatone;
