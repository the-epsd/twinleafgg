"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Munkidoriex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Munkidoriex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.regulationMark = 'H';
        this.cardType = card_types_1.CardType.DARK;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.hp = 210;
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
            name: 'Chains of Control',
            powerType: game_1.PowerType.ABILITY,
            text: 'If this Pokémon is Knocked Out by damage from an opponent\'s attack while you have Pecharunt ex in play, your opponent takes one less prize card.'
        }];
        this.attacks = [{
            name: 'Dirty Headbutt',
            cost: [card_types_1.CardType.DARK, card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
            damage: 190,
            text: 'This Pokémon can\'t use Dirty Headbutt during your next turn.'
        }];
        this.set = 'SV6a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '37';
        this.name = 'Munkidori ex';
        this.fullName = 'Munkidori ex SV6a';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
            effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
            effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
            console.log('marker cleared');
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
            effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
            console.log('second marker added');
        }
        if (effect instanceof game_effects_1.KnockOutEffect) {
            const player = effect.player;
            const targetPlayer = game_1.StateUtils.findOwner(state, effect.target);
            if (player === targetPlayer || targetPlayer.active !== effect.target) {
                return state;
            }
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            const munkidoriActive = player.active;
            const benchPokemon = player.bench.map(b => b.getPokemonCard()).filter(card => card !== undefined);
            const pecharuntexInPlay = benchPokemon.filter(card => card.name == 'Pecharunt ex');
            if (pecharuntexInPlay) {
                if (state.phase === state_1.GamePhase.ATTACK) {
                    if (effect.target === munkidoriActive) {
                        effect.prizeCount -= 1;
                    }
                }
                if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
                    // Check marker
                    if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
                        console.log('attack blocked');
                        throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
                    }
                    effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
                    console.log('marker added');
                }
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.Munkidoriex = Munkidoriex;
