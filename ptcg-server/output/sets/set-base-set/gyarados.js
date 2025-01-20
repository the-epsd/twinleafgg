"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gyarados = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Gyarados extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.set = 'BS';
        this.fullName = 'Gyarados BS';
        this.name = 'Gyarados';
        this.cardType = card_types_1.CardType.WATER;
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Magikarp';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '6';
        this.hp = 100;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Dragon Rage',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.WATER],
                damage: 50,
                text: ''
            },
            {
                name: 'Bubble Beam',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.WATER],
                damage: 40,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            return store.prompt(state, [
                new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED]);
                    store.reduceEffect(state, specialCondition);
                }
            });
        }
        return state;
    }
}
exports.Gyarados = Gyarados;
