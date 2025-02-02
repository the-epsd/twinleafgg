"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloodmoonUrsalunaex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class BloodmoonUrsalunaex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 10000;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
            name: 'Elder\'s Technique',
            powerType: game_1.PowerType.ABILITY,
            text: 'This Pokémon\'s Blood Moon attacks costs 1 Colorless less to use for each Prize card your opponent has already taken.'
        }];
        this.attacks = [
            {
                name: 'Blood Moon',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 250,
                text: 'This Pokémon can\'t attack during your next turn.'
            }
        ];
        this.set = 'SV5a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '52';
        this.name = 'Bloodmoon Ursaluna ex';
        this.fullName = 'Bloodmoon Ursaluna ex SV5a';
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
        if (effect instanceof check_effects_1.CheckAttackCostEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            try {
                const powerEffect = new game_effects_1.PowerEffect(opponent, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            const prizesTaken = 6 - opponent.getPrizeLeft();
            const index = effect.attack.cost.findIndex(c => c === card_types_1.CardType.COLORLESS);
            if (index !== -1) {
                effect.attack.cost.splice(index, prizesTaken);
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
}
exports.BloodmoonUrsalunaex = BloodmoonUrsalunaex;
