"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Greninja = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Greninja extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 140;
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.evolvesFrom = 'Frogadier';
        this.powers = [{
                name: 'Evasion Jutsu',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'If any damage is done to this Pokémon by attacks, flip a coin. If heads, prevent that damage. '
            }];
        this.attacks = [{
                name: 'Furious Shurikens',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER],
                damage: 0,
                text: 'This attack does 50 damage to 2 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'DET';
        this.name = 'Greninja';
        this.fullName = 'Greninja DET';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '9';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.target.cards.includes(this)) {
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(game_1.StateUtils.findOwner(state, effect.target), {
                    name: 'test',
                    powerType: pokemon_types_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(game_1.StateUtils.findOwner(state, effect.target).id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result) {
                    effect.preventDefault = true;
                    return state;
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const max = Math.min(2);
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: max, allowCancel: false }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 50);
                    damageEffect.target = target;
                    store.reduceEffect(state, damageEffect);
                });
                return state;
            });
        }
        return state;
    }
}
exports.Greninja = Greninja;
