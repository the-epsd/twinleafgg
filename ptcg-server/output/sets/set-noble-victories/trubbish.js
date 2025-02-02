"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trubbish = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
class Trubbish extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Garbage Collection',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Put a card from your discard pile on top of your deck.'
            }, {
                name: 'Sludge Bomb',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }];
        this.set = 'NVI';
        this.name = 'Trubbish';
        this.fullName = 'Trubbish NVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '48';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const deckTop = new game_1.CardList();
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, {}, { min: 1, max: 1, allowCancel: false }), selected => {
                const cards = selected || [];
                if (cards === null) {
                    return state;
                }
                player.discard.moveCardsTo(cards, deckTop);
                deckTop.moveToTopOfDestination(player.deck);
            });
        }
        return state;
    }
}
exports.Trubbish = Trubbish;
