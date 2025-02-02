"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wartortle = void 0;
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_message_1 = require("../../game/game-message");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Wartortle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Squirtle';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING, }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Free Diving',
                cost: [card_types_1.CardType.WATER],
                damage: 0,
                text: 'Put up to 3 Water Energy cards from your discard pile into your hand.'
            },
            {
                name: 'Spinning Attack',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER],
                damage: 50,
                text: ''
            }
        ];
        this.set = 'MEW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '8';
        this.name = 'Wartortle';
        this.fullName = 'Wartortle MEW';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const prompt = new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, {
                cardType: card_types_1.CardType.WATER
            }, {
                min: 0,
                max: 3
            });
            state = store.prompt(state, prompt, chosenCards => {
                player.discard.moveCardsTo(chosenCards, player.hand);
            });
        }
        return state;
    }
}
exports.Wartortle = Wartortle;
