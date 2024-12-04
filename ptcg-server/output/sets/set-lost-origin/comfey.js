"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comfey = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const card_list_1 = require("../../game/store/state/card-list");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_message_1 = require("../../game/game-message");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Comfey extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'F';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Flower Selecting',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, if this Pokémon is in the Active Spot, you may look at the top 2 cards of your deck and put 1 of them into your hand. Put the other card in the Lost Zone.'
            }];
        this.attacks = [
            {
                name: 'Spinning Attack',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '79';
        this.name = 'Comfey';
        this.fullName = 'Comfey LOR';
        this.FLOWER_SELECTING_MARKER = 'FLOWER_SELECTING_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.FLOWER_SELECTING_MARKER, this);
            return state;
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.FLOWER_SELECTING_MARKER, this)) {
                throw new game_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.active.cards[0] !== this) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            const deckTop = new card_list_1.CardList();
            player.deck.moveTo(deckTop, 2);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                }
            });
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, deckTop, {}, { min: 1, max: 1, allowCancel: false }), selected => {
                player.marker.addMarker(this.FLOWER_SELECTING_MARKER, this);
                deckTop.moveCardsTo(selected, player.hand);
                deckTop.moveTo(player.lostzone);
                return state;
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.FLOWER_SELECTING_MARKER, this);
        }
        return state;
    }
}
exports.Comfey = Comfey;
