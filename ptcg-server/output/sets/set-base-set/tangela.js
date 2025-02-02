"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tangela = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
class Tangela extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Tangela';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '66';
        this.set = 'BS';
        this.fullName = 'Tangela';
        this.cardType = card_types_1.CardType.GRASS;
        this.stage = card_types_1.Stage.BASIC;
        this.evolvesInto = 'Tangrowth';
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Bind',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            },
            {
                name: 'Poisonpowder',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.GRASS],
                damage: 20,
                text: 'The Defending Pokémon is now Poisoned.'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            return store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.COIN_FLIP), (heads) => {
                if (heads) {
                    const condition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED]);
                    store.reduceEffect(state, condition);
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const condition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.POISONED]);
            store.reduceEffect(state, condition);
        }
        return state;
    }
}
exports.Tangela = Tangela;
