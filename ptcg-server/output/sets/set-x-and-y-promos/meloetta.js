"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meloetta = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Meloetta extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Soprano Wave',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 0,
                text: 'Flip 3 coins. This attack does 10 damage times the number of heads to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Entrancing Melody',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC],
                damage: 30,
                text: 'Your opponent\'s Active Pokémon is now Confused.'
            }];
        this.set = 'XYP';
        this.setNumber = '193';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Meloetta';
        this.fullName = 'Meloetta XYP';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let heads = 0;
            store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], results => {
                results.forEach(r => { heads += r ? 1 : 0; });
                if (heads === 0) {
                    return state;
                }
                opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                    const damage = 10 * heads;
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, damage);
                    damageEffect.target = cardList;
                    store.reduceEffect(state, damageEffect);
                });
                return state;
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.CONFUSED]);
            store.reduceEffect(state, specialConditionEffect);
        }
        return state;
    }
}
exports.Meloetta = Meloetta;
