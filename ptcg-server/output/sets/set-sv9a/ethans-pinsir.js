"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthansPinsir = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class EthansPinsir extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'I';
        this.tags = [card_types_1.CardTag.ETHANS];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 120;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Vice Grip',
                cost: [G],
                damage: 20,
                text: ''
            },
            {
                name: 'One-Point Return',
                cost: [C, C, C],
                damage: 70,
                damageCalculation: '+',
                text: 'If any of your Ethan\'s Pokémon were Knocked Out by damage from an attack from your opponent\'s Pokémon during their last turn, this attack does 100 more damage.'
            }
        ];
        this.set = 'SV9a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '1';
        this.name = 'Ethan\'s Pinsir';
        this.fullName = 'Ethan\'s Pinsir SV9a';
        this.RETALIATE_MARKER = 'RETALIATE_MARKER';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.RETALIATE_MARKER);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.RETALIATE_MARKER)) {
                effect.damage += 100;
            }
        }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Do not activate between turns, or when it's not opponents turn.
            if (state.phase !== game_1.GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
                return state;
            }
            // activate only if the knocked out thing is an ethan's pokemon
            if (!((_a = effect.target.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.ETHANS))) {
                return state;
            }
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner === player) {
                effect.player.marker.addMarkerToState(this.RETALIATE_MARKER);
            }
            return state;
        }
        return state;
    }
}
exports.EthansPinsir = EthansPinsir;
