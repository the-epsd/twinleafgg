"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LucarioEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
class LucarioEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 180;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Missile Jab',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 30,
                text: 'This attack\'s damage isn\'t affected by Resistance.'
            }, {
                name: 'Corkscrew Smash',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING],
                damage: 60,
                text: 'You may draw cards until you have 6 cards in your hand.'
            }, {
                name: 'Somersault Kick',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING],
                damage: 100,
                text: ''
            }
        ];
        this.set = 'FFI';
        this.name = 'Lucario EX';
        this.fullName = 'Lucario EX FFI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '54';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            effect.ignoreResistance = true;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const cardsToDraw = 6 - player.hand.cards.length;
            if (cardsToDraw <= 0) {
                return state;
            }
            return store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_message_1.GameMessage.WANT_TO_DRAW_CARDS), result => {
                if (result) {
                    player.deck.moveTo(player.hand, cardsToDraw);
                }
            });
        }
        return state;
    }
}
exports.LucarioEx = LucarioEx;
