"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rockruff = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const confirm_cards_prompt_1 = require("../../game/store/prompts/confirm-cards-prompt");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Rockruff extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'I';
        this.cardType = F;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.resistance = [];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Dig It Up',
                cost: [C],
                damage: 0,
                text: 'Look at the top card of your deck. You may discard that card.'
            },
            { name: 'Stampede', cost: [C, C], damage: 20, text: '' },
        ];
        this.set = 'JTG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '84';
        this.name = 'Rockruff';
        this.fullName = 'Rockruff JTG';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            prefabs_1.BLOCK_IF_DECK_EMPTY(player);
            const deckTop = new game_1.CardList();
            player.deck.moveTo(deckTop, 1);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                }
            });
            return store.prompt(state, new confirm_cards_prompt_1.ConfirmCardsPrompt(player.id, game_1.GameMessage.DISCARD_FROM_TOP_OF_DECK, deckTop.cards, // Fix error by changing toArray() to cards
            { allowCancel: true }), selected => {
                if (selected !== null) {
                    // Discard card
                    deckTop.moveCardsTo(deckTop.cards, player.discard);
                }
                else {
                    // Move back to the top of your deck
                    deckTop.moveToTopOfDestination(player.deck);
                }
            });
        }
        return state;
    }
}
exports.Rockruff = Rockruff;
