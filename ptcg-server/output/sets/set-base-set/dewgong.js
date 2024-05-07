"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dewgong = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
class Dewgong extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Dewgong';
        this.set = 'BS';
        this.fullName = 'Dewgong BS';
        this.cardType = card_types_1.CardType.WATER;
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Seel';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '25';
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Aurora Beam',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            },
            {
                name: 'Ice Beam',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            return store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.COIN_FLIP), (heads) => {
                if (heads) {
                    const condition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED]);
                    store.reduceEffect(state, condition);
                }
            });
        }
        return state;
    }
}
exports.Dewgong = Dewgong;
