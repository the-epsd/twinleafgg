"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meditite = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Meditite extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 50;
        this.weakness = [{ type: P, value: +10 }];
        this.retreat = [C];
        this.evolvesInto = 'Medicham';
        this.attacks = [{
                name: 'Detect',
                cost: [F],
                damage: 0,
                text: 'Flip a coin. If heads, prevent all effects of attacks, including damage, done to this Pokemon during your opponent\'s next turn.'
            },
            {
                name: 'Meditate',
                cost: [F, C],
                damage: 10,
                text: 'Does 10 damage plus 10 more damage for each damage counter on the Defending Pokémon.'
            }];
        this.set = 'DP';
        this.name = 'Meditite';
        this.fullName = 'Meditite DP';
        this.setNumber = '89';
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
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            effect.damage += opponent.active.damage;
            return state;
        }
        return state;
    }
}
exports.Meditite = Meditite;
