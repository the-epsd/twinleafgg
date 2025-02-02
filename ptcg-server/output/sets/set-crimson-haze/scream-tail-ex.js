"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreamTailex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class ScreamTailex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.POKEMON_ex, game_1.CardTag.ANCIENT];
        this.regulationMark = 'H';
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.PSYCHIC;
        this.hp = 190;
        this.weakness = [{ type: game_1.CardType.DARK }];
        this.resistance = [{ type: game_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Sudden Shriek',
                cost: [game_1.CardType.COLORLESS],
                damage: 0,
                text: 'You can use this attack only if you go second, and only during your first turn. During your opponent\'s next turn, they can\'t play any Supporter cards from their hand.'
            },
            {
                name: 'Crunch',
                cost: [game_1.CardType.PSYCHIC, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 120,
                text: 'Discard an Energy from your opponent\'s Active Pokémon.'
            }
        ];
        this.set = 'SV5a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '40';
        this.name = 'Scream Tail ex';
        this.fullName = 'Scream Tail ex SV5a';
        this.SUDDEN_SHRIEK_MARKER = 'SUDDEN_SHRIEK_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            // Get current turn
            const turn = state.turn;
            // Check if it is player's first turn
            if (turn !== 2) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            else {
                const player = effect.player;
                const opponent = game_1.StateUtils.getOpponent(state, player);
                opponent.marker.addMarker(this.SUDDEN_SHRIEK_MARKER, this);
            }
            if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
                const player = effect.player;
                const opponent = game_1.StateUtils.getOpponent(state, player);
                // Defending Pokemon has no energy cards attached
                if (!opponent.active.cards.some(c => c instanceof game_1.EnergyCard)) {
                    return state;
                }
                let card;
                return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: game_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                    card = selected[0];
                    opponent.active.moveCardTo(card, opponent.discard);
                    return state;
                });
            }
            if (effect instanceof play_card_effects_1.PlaySupporterEffect) {
                const player = effect.player;
                const opponent = game_1.StateUtils.getOpponent(state, player);
                if (opponent.marker.hasMarker(this.SUDDEN_SHRIEK_MARKER, this)) {
                    throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
                }
            }
            if (effect instanceof game_phase_effects_1.EndTurnEffect) {
                effect.player.marker.removeMarker(this.SUDDEN_SHRIEK_MARKER, this);
            }
        }
        return state;
    }
}
exports.ScreamTailex = ScreamTailex;
