"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Whiscash = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Whiscash extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.evolvesFrom = 'Barboach';
        this.hp = 140;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Raging and Rocking',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 0,
                text: 'For each [F] Energy attached to this Pokémon, discard the top card of your opponent\'s deck.'
            },
            {
                name: 'Land Crush',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 140,
                text: ''
            }];
        this.set = 'OBF';
        this.setNumber = '109';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Whiscash';
        this.fullName = 'Whiscash OBF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            // Count total FIGHTING energy provided
            const totalFightingnergy = checkProvidedEnergy.energyMap.reduce((sum, energy) => {
                return sum + energy.provides.filter(type => type === card_types_1.CardType.FIGHTING || type === card_types_1.CardType.ANY).length;
            }, 0);
            opponent.deck.moveTo(opponent.discard, totalFightingnergy);
        }
        return state;
    }
}
exports.Whiscash = Whiscash;
