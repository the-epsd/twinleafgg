"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Altaria = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const card_list_1 = require("../../game/store/state/card-list");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_1 = require("../../game");
class Altaria extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Swablu';
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 90;
        this.retreat = [];
        this.powers = [{
                name: 'Tempting Tune',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn, you may search your deck for a Supporter card, reveal it, shuffle your deck, then put that card on top of it.'
            }];
        this.attacks = [{
                name: 'Glide',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.METAL],
                damage: 60,
                text: ''
            }];
        this.set = 'EVS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '106';
        this.name = 'Altaria';
        this.fullName = 'Altaria EVS';
        this.FOREWARN_MARKER = 'FOREWARN_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.FOREWARN_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.FOREWARN_MARKER, this)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            player.marker.addMarker(this.FOREWARN_MARKER, this);
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { min: 0, max: 1, allowCancel: false }), selected => {
                if (selected.length > 0) {
                    const card = selected[0];
                    const deckTop = new card_list_1.CardList();
                    player.deck.moveCardTo(card, deckTop);
                    state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                    });
                    deckTop.moveToTopOfDestination(player.deck);
                }
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.FOREWARN_MARKER, this)) {
            effect.player.marker.removeMarker(this.FOREWARN_MARKER, this);
        }
        return state;
    }
}
exports.Altaria = Altaria;
