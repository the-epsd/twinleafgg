"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HisuianBasculegion = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class HisuianBasculegion extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Hisuian Basculin';
        this.attacks = [{
                name: 'Grudge Dive',
                cost: [card_types_1.CardType.WATER],
                damage: 30,
                damageCalculation: '+',
                text: 'If any of your Pokémon were Knocked Out by damage from an attack from your opponent\'s Pokémon during their last turn, this attack does 90 more damage, and your opponent\'s Active Pokémon is now Confused.'
            },
            {
                name: 'Jet Headbutt',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: ''
            }];
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '44';
        this.name = 'Hisuian Basculegion';
        this.fullName = 'Hisuian Basculegion ASR';
        this.GRUDGE_DIVE_MARKER = 'GRUDGE_DIVE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.GRUDGE_DIVE_MARKER)) {
                effect.damage += 90;
                const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.CONFUSED]);
                store.reduceEffect(state, specialConditionEffect);
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
                effect.player.marker.addMarkerToState(this.GRUDGE_DIVE_MARKER);
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.GRUDGE_DIVE_MARKER);
        }
        return state;
    }
}
exports.HisuianBasculegion = HisuianBasculegion;
