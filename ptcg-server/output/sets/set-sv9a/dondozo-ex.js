"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dondozoex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dondozoex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.regulationMark = 'I';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 260;
        this.weakness = [{ type: L }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Tsunami Reversal',
                cost: [W, C],
                damage: 30,
                damageCalculation: '+',
                text: 'This attack does 10 more damage for each damage counter on this Pokémon.'
            },
            {
                name: 'Dynamic Dive',
                cost: [W, W, C, C],
                damage: 120,
                damageCalculation: '+',
                text: 'You may do 120 more damage. If you do, this Pokémon also does 50 damage to itself.'
            },
        ];
        this.set = 'SV9a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '32';
        this.name = 'Dondozo ex';
        this.fullName = 'Dondozo ex SV9a';
    }
    reduceEffect(store, state, effect) {
        // Tsunami Reversal
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            effect.damage += effect.player.active.damage;
        }
        // Dynamic Dive
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_message_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    effect.damage += 120;
                    prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 50);
                }
            });
        }
        return state;
    }
}
exports.Dondozoex = Dondozoex;
