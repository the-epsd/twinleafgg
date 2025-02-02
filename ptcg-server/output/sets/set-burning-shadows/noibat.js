"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Noibat = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Noibat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 50;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Agility',
                cost: [C],
                damage: 10,
                text: 'Flip a coin. If heads, prevent all effects of attacks, including damage, done to this Pokemon during your opponent\'s next turn.'
            }];
        this.set = 'BUS';
        this.name = 'Noibat';
        this.fullName = 'Noibat BUS';
        this.setNumber = '109';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    if (effect instanceof attack_effects_1.PutDamageEffect) {
                        effect.preventDefault = true;
                    }
                    if (effect instanceof attack_effects_1.AbstractAttackEffect) {
                        effect.preventDefault = true;
                    }
                }
            });
        }
        return state;
    }
}
exports.Noibat = Noibat;
