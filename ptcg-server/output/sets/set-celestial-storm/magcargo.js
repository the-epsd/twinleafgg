"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magcargo = void 0;
const game_1 = require("../../game");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const card_list_1 = require("../../game/store/state/card-list");
function* useSmoothOver(next, store, state, self, effect) {
    const player = effect.player;
    let cards = [];
    if (player.deck.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
    }
    const deckTop = new card_list_1.CardList();
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARDS_TO_PUT_ON_TOP_OF_THE_DECK, player.deck, {}, { min: 1, max: 1, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    player.deck.moveCardsTo(cards, deckTop);
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === self) {
            cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
        }
    });
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
        if (order === null) {
            return state;
        }
        deckTop.applyOrder(order);
        deckTop.moveToTopOfDestination(player.deck);
    });
}
class Magcargo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Slugma';
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Smooth Over',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn, you may search your deck for a card, shuffle your deck, then put that card on top of it.'
            }];
        this.attacks = [{
                name: 'Combustion',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            }];
        this.set = 'CES';
        this.name = 'Magcargo';
        this.fullName = 'Magcargo CES';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '24';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const generator = useSmoothOver(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Magcargo = Magcargo;
