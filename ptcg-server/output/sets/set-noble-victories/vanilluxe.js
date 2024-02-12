"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vanilluxe = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const game_message_1 = require("../../game/game-message");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Vanilluxe extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Vanillish';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Double Freeze',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 40,
                text: 'Flip 2 coins. This attack does 40 damage times the number of heads. ' +
                    'If either of them is heads, the Defending Pokemon is now Paralyzed.'
            },
            {
                name: 'Frost Breath',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER],
                damage: 60,
                text: ''
            }];
        this.set = 'NVI';
        this.name = 'Vanilluxe';
        this.fullName = 'Vanilluxe NVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '29';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP),
                new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP)
            ], results => {
                let heads = 0;
                results.forEach(r => { heads += r ? 1 : 0; });
                effect.damage = 40 * heads;
                if (heads > 0) {
                    const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED]);
                    store.reduceEffect(state, specialConditionEffect);
                }
            });
        }
        return state;
    }
}
exports.Vanilluxe = Vanilluxe;
