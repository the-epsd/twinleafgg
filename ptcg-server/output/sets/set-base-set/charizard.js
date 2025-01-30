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
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Charmeleon';
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
                powerType: game_1.PowerType.POKEMON_POWER,
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
        this.cardImage = 'assets/cardback.png';
        this.ENERGY_BURN_MARKER = 'ENERGY_BURN_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList.specialConditions.includes(card_types_1.SpecialCondition.ASLEEP) ||
                cardList.specialConditions.includes(card_types_1.SpecialCondition.CONFUSED) ||
                cardList.specialConditions.includes(card_types_1.SpecialCondition.PARALYZED)) {
                return state;
            }
            // Get the energy map for the player
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            if (player.marker.hasMarker(this.ENERGY_BURN_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                }
            });
            player.marker.addMarker(this.ENERGY_BURN_MARKER, this);
        }
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this) && effect.player.marker.hasMarker(this.ENERGY_BURN_MARKER, this)) {
            effect.source.cards.forEach(c => {
                if (c instanceof game_1.EnergyCard && !effect.energyMap.some(e => e.card === c)) {
                    effect.energyMap.push({ card: c, provides: [card_types_1.CardType.FIRE] });
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.player.marker.hasMarker(this.ENERGY_BURN_MARKER, this)) {
            effect.attack.cost = effect.attack.cost.map(() => card_types_1.CardType.FIRE);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ENERGY_BURN_MARKER, this)) {
            effect.player.marker.removeMarker(this.ENERGY_BURN_MARKER, this);
        }
        return state;
    }
}
exports.Charizard = Charizard;
