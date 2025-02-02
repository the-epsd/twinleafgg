"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lugia = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
class Lugia extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'D';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Gust',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }, {
                name: 'Energy Loop',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: 'Put an Energy attached to this Pokémon into your hand.'
            },
        ];
        this.set = 'DAA';
        this.name = 'Lugia';
        this.fullName = 'Lugia DAA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '140';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            let card;
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                card = selected[0];
                player.active.moveCardTo(card, player.hand);
                return state;
            });
        }
        return state;
    }
}
exports.Lugia = Lugia;
