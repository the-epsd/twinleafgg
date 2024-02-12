"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shelmet = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_message_1 = require("../../game/game-message");
class Shelmet extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Body Slam',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS],
                damage: 20,
                text: 'Flip a coin. If heads, the Defending Pokemon is now Paralyzed.'
            }];
        this.set = 'DEX';
        this.name = 'Shelmet';
        this.fullName = 'Shelmet DEX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '10';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP)
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
exports.Shelmet = Shelmet;
