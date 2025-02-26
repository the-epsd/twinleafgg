"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gothitelle = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Gothitelle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Gothorita';
        this.cardType = P;
        this.hp = 150;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Read the Stars',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, you may look at the top 2 cards of your opponent\'s deck and put 1 of them back. Put the other card on the bottom of their deck.'
            }];
        this.attacks = [
            {
                name: 'Psych Out',
                cost: [P, C],
                damage: 120,
                text: 'Discard a random card from your opponent\'s hand.'
            }
        ];
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '92';
        this.name = 'Gothitelle';
        this.fullName = 'Gothitelle PAL';
        this.READ_THE_STARS_MARKER = 'READ_THE_STARS_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Read the Stars
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.deck.cards.length < 2) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (prefabs_1.HAS_MARKER(this.READ_THE_STARS_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            let cards = [];
            const deckTop = new game_1.CardList();
            opponent.deck.moveTo(deckTop, 2);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ON_BOTTOM, deckTop, {}, { min: 1, max: 1, allowCancel: false }), selected => {
                cards = selected || [];
                prefabs_1.ABILITY_USED(player, this);
                prefabs_1.ADD_MARKER(this.READ_THE_STARS_MARKER, player, this);
                deckTop.moveCardsTo(cards, opponent.deck);
                deckTop.moveToTopOfDestination(opponent.deck);
            });
        }
        // Psych Out
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            if (opponent.hand.cards.length === 0) {
                return state;
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, {}, { allowCancel: false, min: 1, max: 1, isSecret: true }), cards => {
                cards = cards || [];
                store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => []);
                opponent.hand.moveCardsTo(cards, opponent.discard);
            });
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.READ_THE_STARS_MARKER, this);
        return state;
    }
}
exports.Gothitelle = Gothitelle;
