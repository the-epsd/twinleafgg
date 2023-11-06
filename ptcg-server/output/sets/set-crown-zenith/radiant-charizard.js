"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadiantCharizard = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class RadiantCharizard extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.RADIANT];
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 160;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Excited Heart',
                powerType: game_1.PowerType.ABILITY,
                text: 'This Pokémon\'s attacks cost C less for each Prize card your opponent has taken.'
            }];
        this.attacks = [
            {
                name: 'Combustion Blast',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 250,
                text: 'During your next turn, this Pokémon can\'t use Combustion Blast.'
            }
        ];
        this.set = 'CRZ';
        this.set2 = 'crownzenith';
        this.setNumber = '20';
        this.name = 'Radiant Charizard';
        this.fullName = 'Radiant Charizard CRZ';
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
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            if (effect instanceof check_effects_1.CheckAttackCostEffect) {
                const player = effect.player;
                const opponent = game_1.StateUtils.getOpponent(state, player);
                const index = this.attacks[0].cost.indexOf(card_types_1.CardType.COLORLESS);
                const prizesTaken = 6 - opponent.getPrizeLeft();
                this.attacks[0].cost[index] -= prizesTaken;
                const checkCost = new check_effects_1.CheckAttackCostEffect(player, this.attacks[0]);
                state = store.reduceEffect(state, checkCost);
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
exports.RadiantCharizard = RadiantCharizard;
