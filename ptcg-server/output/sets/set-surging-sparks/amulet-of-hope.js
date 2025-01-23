"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmuletofHope = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_1 = require("../../game");
class AmuletofHope extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.ACE_SPEC];
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'SSP';
        this.setNumber = '162';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'H';
        this.name = 'Amulet of Hope';
        this.fullName = 'Amulet of Hope SSP';
        this.text = 'If the Pokémon this card is attached to is Knocked Out by damage from an attack from your opponent\'s Pokémon, search your deck for up to 3 cards and put them into your hand. Then, shuffle your deck.';
        this.AMULET_OF_HOPE_MARKER = 'AMULET_OF_HOPE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            if (state.phase !== state_1.GamePhase.ATTACK) {
                return state;
            }
            const target = effect.target;
            const cards = target.getPokemons();
            cards.forEach(card => {
                player.marker.addMarker(this.AMULET_OF_HOPE_MARKER, card);
            });
        }
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect) {
            state.players.forEach(player => {
                if (!player.marker.hasMarker(this.AMULET_OF_HOPE_MARKER)) {
                    return state;
                }
                if (player.deck.cards.length === 0) {
                    return state;
                }
                store.log(state, game_1.GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, card: 'Amulet of Hope' });
                let cards = [];
                store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 0, max: 3, allowCancel: false }), selected => {
                    cards = selected || [];
                    player.deck.moveCardsTo(cards, player.hand);
                });
                store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
                player.marker.removeMarker(this.AMULET_OF_HOPE_MARKER);
            });
        }
        return state;
    }
}
exports.AmuletofHope = AmuletofHope;
