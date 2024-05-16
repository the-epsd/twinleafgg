"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Venusaur = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Venusaur extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.evolvesFrom = 'Ivysaur';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 160;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Jungle Totem',
                powerType: game_1.PowerType.ABILITY,
                text: 'Each basic [G] Energy attached to your Pokémon provides [G][G] Energy. You can\'t apply more than 1 Jungle Totem Ability at a time.'
            }];
        this.attacks = [
            {
                name: 'Solar Beam',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 90,
                text: '',
            }
        ];
        this.set = 'SLG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '3';
        this.name = 'Venusaur';
        this.fullName = 'Venusaur SLG';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const pokemon = player.active || player.bench.find(p => p.getPokemons());
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, pokemon);
            store.reduceEffect(state, checkEnergy);
            checkEnergy.energyMap.forEach(em => {
                const energyCard = em.card;
                if (energyCard instanceof game_1.EnergyCard && energyCard.provides.includes(card_types_1.CardType.GRASS)) {
                    energyCard.provides = [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS];
                }
            });
        }
        return state;
    }
}
exports.Venusaur = Venusaur;
