"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charizard = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Charizard extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 120;
        this.weakness = [{
                type: card_types_1.CardType.WATER
            }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Energy Burn',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'As often as you like during your turn (before your attack), you may turn all Energy attached to Charizard into R Energy for the rest of the turn. This power can\'t be used if Charizard is Asleep, Confused, or Paralyzed.'
            }];
        this.attacks = [
            {
                name: 'Fire Spin',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.FIRE],
                damage: 100,
                text: 'Discard 2 Energy cards attached to Charizard in order to use this attack.'
            }
        ];
        this.set = 'BS';
        this.setNumber = '4';
        this.name = 'Charizard';
        this.fullName = 'Charizard BS';
        this.ENERGY_BURN_MARKER = 'ENERGY_BURN_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            // Get the energy map for the player
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            if (player.marker.hasMarker(this.ENERGY_BURN_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
                player.marker.addMarker(this.ENERGY_BURN_MARKER, this);
                const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.source);
                store.reduceEffect(state, checkPokemonType);
                checkProvidedEnergy.energyMap.forEach(attachedEnergy => {
                    attachedEnergy.provides.splice(card_types_1.CardType.FIRE);
                    return state;
                });
                if (effect instanceof game_phase_effects_1.EndTurnEffect) {
                    effect.player.marker.removeMarker(this.ENERGY_BURN_MARKER, this);
                }
                return state;
            }
        }
        return state;
    }
}
exports.Charizard = Charizard;
