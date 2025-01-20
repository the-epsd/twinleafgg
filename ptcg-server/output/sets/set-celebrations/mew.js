"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mew = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const card_list_1 = require("../../game/store/state/card-list");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_message_1 = require("../../game/game-message");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Mew extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'E';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Mysterious Tail',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, if this Pokémon is in the Active Spot, you may look at the top 6 cards of your deck, reveal an Item card you find there, and put it into your hand. Shuffle the other cards back into your deck.'
            }];
        this.attacks = [
            {
                name: 'Psyshot',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'CEL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '11';
        this.name = 'Mew';
        this.fullName = 'Mew CEL';
        this.MYSTERIOUS_TAIL_MARKER = 'MYSTERIOUS_TAIL_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.MYSTERIOUS_TAIL_MARKER, this);
            return state;
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.MYSTERIOUS_TAIL_MARKER, this)) {
                throw new game_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.active.cards[0] !== this) {
                return state; // Not active
            }
            const deckTop = new card_list_1.CardList();
            player.deck.moveTo(deckTop, 6);
            const opponent = game_1.StateUtils.getOpponent(state, player);
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, deckTop, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.ITEM }, { min: 0, max: 1, allowCancel: true }), selected => {
                player.marker.addMarker(this.MYSTERIOUS_TAIL_MARKER, this);
                deckTop.moveCardsTo(selected, player.hand);
                deckTop.moveTo(player.deck);
                if (selected.length > 0) {
                    return store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, selected), () => {
                    });
                }
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.MYSTERIOUS_TAIL_MARKER, this)) {
            const player = effect.player;
            player.marker.removeMarker(this.MYSTERIOUS_TAIL_MARKER, this);
        }
        return state;
    }
}
exports.Mew = Mew;
