"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NidoranMale = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
class NidoranMale extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Nidoran M';
        this.cardImage = 'assets/cardback.png';
        this.set = 'BS';
        this.setNumber = '55';
        this.fullName = 'Nidoran M BS';
        this.cardType = card_types_1.CardType.GRASS;
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 40;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Horn Hazard',
                cost: [card_types_1.CardType.GRASS],
                damage: 30,
                text: 'Flip a coin. If tails, this attack does nothing.'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            return store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.COIN_FLIP), (heads) => {
                if (!heads) {
                    effect.damage = 0;
                }
            });
        }
        return state;
    }
}
exports.NidoranMale = NidoranMale;
