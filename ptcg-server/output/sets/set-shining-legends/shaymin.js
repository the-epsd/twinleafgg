"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shaymin = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Shaymin extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Flippity Flap',
                cost: [G],
                damage: 30,
                text: 'Shuffle your hand into your deck. Then, draw 6 cards.'
            },
            {
                name: 'Rally Back',
                cost: [G, C],
                damage: 30,
                damageCalculation: '+',
                text: 'If any of your Pokémon were Knocked Out by damage from an opponent\'s ' +
                    'attack during their last turn, this attack does 90 more damage.'
            }];
        this.set = 'SLG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '7';
        this.name = 'Shaymin';
        this.fullName = 'Shaymin SLG';
        this.RALLY_BACK_MARKER = 'RALLY_BACK_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            prefabs_1.MOVE_CARDS(store, state, player.hand, player.deck, { cards: player.hand.cards });
            prefabs_1.SHUFFLE_DECK(store, state, player);
            prefabs_1.DRAW_CARDS(player, 6);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            if (player.marker.hasMarker(this.RALLY_BACK_MARKER)) {
                effect.damage += 90;
            }
            return state;
        }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Do not activate between turns, or when it's not opponents turn.
            if (state.phase !== game_1.GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
                return state;
            }
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner === player) {
                owner.marker.addMarkerToState(this.RALLY_BACK_MARKER);
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.RALLY_BACK_MARKER);
        }
        return state;
    }
}
exports.Shaymin = Shaymin;
