"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Excadrill = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Excadrill extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Drilbur';
        this.cardType = F;
        this.hp = 120;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Rototiller',
                cost: [F],
                damage: 0,
                text: 'Shuffle 4 cards from your discard pile into your deck.'
            },
            {
                name: 'Slash',
                cost: [F, C, C],
                damage: 90,
                text: ''
            },
        ];
        this.set = 'UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '119';
        this.name = 'Excadrill';
        this.fullName = 'Excadrill UNM';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.discard.cards.length > 0) {
                const minCards = Math.min(4, player.discard.cards.length);
                state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, {}, { min: minCards, max: 4, allowCancel: false }), selected => {
                    const cards = selected || [];
                    store.prompt(state, [new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards)], () => {
                        player.discard.moveCardsTo(cards, player.deck);
                    });
                    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                    });
                });
            }
        }
        return state;
    }
}
exports.Excadrill = Excadrill;
