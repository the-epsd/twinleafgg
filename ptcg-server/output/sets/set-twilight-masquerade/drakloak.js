"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drakloak = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const card_list_1 = require("../../game/store/state/card-list");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_message_1 = require("../../game/game-message");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Drakloak extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Dreepy';
        this.regulationMark = 'H';
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 90;
        this.weakness = [];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Recon Directive',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may look at the top 2 cards of your deck and put 1 of them into your hand. Put the other card on the bottom of your deck.'
            }];
        this.attacks = [
            {
                name: 'Dragon Headbutt',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.PSYCHIC],
                damage: 70,
                text: ''
            }
        ];
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '129';
        this.name = 'Drakloak';
        this.fullName = 'Drakloak TWM';
        this.TELLING_SPIRIT_MARKER = 'TELLING_SPIRIT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.TELLING_SPIRIT_MARKER, this);
            return state;
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.TELLING_SPIRIT_MARKER, this)) {
                throw new game_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            const deckBottom = new card_list_1.CardList();
            const deckTop = new card_list_1.CardList();
            player.deck.moveTo(deckTop, 2);
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, deckTop, {}, { min: 1, max: 1, allowCancel: true }), selected => {
                player.marker.addMarker(this.TELLING_SPIRIT_MARKER, this);
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
                deckTop.moveCardsTo(selected, player.hand);
                deckTop.moveTo(deckBottom);
                deckBottom.moveTo(player.deck);
                return state;
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.TELLING_SPIRIT_MARKER, this);
        }
        return state;
    }
}
exports.Drakloak = Drakloak;
