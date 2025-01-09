"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ceruledge = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Ceruledge extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Charcadet';
        this.hp = 140;
        this.cardType = R;
        this.weakness = [{ type: W }];
        this.attacks = [
            {
                name: 'Blaze Curse',
                cost: [C],
                damage: 0,
                text: 'Discard all Special Energy from each of your opponent\'s Pokémon.'
            },
            {
                name: 'Amethyst Rage',
                cost: [R, R, C],
                damage: 160,
                text: 'During your next turn, this Pokémon can\'t attack..'
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SV8';
        this.name = 'Ceruledge';
        this.fullName = 'Ceruledge SV8';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '22';
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
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let allSpecialEnergy = [];
            // Check active Pokémon
            const activeCheckProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            state = store.reduceEffect(state, activeCheckProvidedEnergy);
            allSpecialEnergy = allSpecialEnergy.concat(activeCheckProvidedEnergy.energyMap.filter(em => em.card.energyType === card_types_1.EnergyType.SPECIAL).map(em => em.card));
            // Check bench Pokémon
            opponent.bench.forEach(benchSlot => {
                const benchCheckProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent, benchSlot);
                state = store.reduceEffect(state, benchCheckProvidedEnergy);
                allSpecialEnergy = allSpecialEnergy.concat(benchCheckProvidedEnergy.energyMap.filter(em => em.card.energyType === card_types_1.EnergyType.SPECIAL).map(em => em.card));
            });
            // Discard all special energy
            if (allSpecialEnergy.length > 0) {
                allSpecialEnergy.forEach(energy => {
                    energy.cards.moveTo(opponent.discard);
                });
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
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
}
exports.Ceruledge = Ceruledge;
