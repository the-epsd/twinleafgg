"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Koffing = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
class Koffing extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Koffing';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '51';
        this.set = 'BS';
        this.fullName = 'Koffing BS';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Foul Gas',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS],
                damage: 10,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned; if tails, it is now Confused.'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            return store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.COIN_FLIP), (heads) => {
                const condition = heads
                    ? new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.POISONED])
                    : new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.CONFUSED]);
                store.reduceEffect(state, condition);
            });
        }
        return state;
    }
}
exports.Koffing = Koffing;
