"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Octillery = exports.useRapidStrikeSearch = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const card_1 = require("../../game/store/card/card");
function* useRapidStrikeSearch(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    let cards = [];
    const blocked = [];
    player.deck.cards.forEach((card, index) => {
        if (!(card instanceof card_1.Card && card.tags.includes(card_types_1.CardTag.RAPID_STRIKE))) {
            blocked.push(index);
        }
    });
    if (player.usedRapidStrikeSearchThisTurn) {
        throw new game_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
    }
    player.usedRapidStrikeSearchThisTurn = true;
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 1, max: 1, allowCancel: true, blocked }), selected => {
        cards = selected || [];
        next();
    });
    player.deck.moveCardsTo(cards, player.hand);
    if (cards.length > 0) {
        yield store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
exports.useRapidStrikeSearch = useRapidStrikeSearch;
class Octillery extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Remoraid';
        this.regulationMark = 'E';
        this.tags = [card_types_1.CardTag.RAPID_STRIKE];
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Rapid Strike Search',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may search your deck for a ' +
                    'Rapid Strike card, reveal it, and put it into your hand. ' +
                    'Then, shuffle your deck. You can\'t use more than 1 Rapid ' +
                    'Strike Search Ability each turn.'
            }];
        this.attacks = [
            {
                name: 'Waterfall',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            }
        ];
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '37';
        this.name = 'Octillery';
        this.fullName = 'Octillery BST';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const generator = useRapidStrikeSearch(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Octillery = Octillery;
