"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HisuianElectrodeV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class HisuianElectrodeV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 210;
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Tantrum Blast',
                cost: [],
                damage: 100,
                text: 'This attack does 100 damage for each Special Condition affecting this Pokémon.'
            },
            {
                name: 'Solar Shot',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: 'Discard all Energy from this Pokémon.'
            },
        ];
        this.regulationMark = 'F';
        this.set = 'SWSH';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '294';
        this.name = 'Hisuian Electrode V';
        this.fullName = 'Hisuian Electrode V SWSH';
        this.SOLAR_SHOT_MARKER = 'SOLAR_SHOT_MARKER';
        this.CLEAR_SOLAR_SHOT_MARKER = 'CLEAR_SOLAR_SHOT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const cardList = game_1.StateUtils.findCardList(state, this);
            effect.damage = cardList.specialConditions.length * 100;
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            const cards = checkProvidedEnergy.energyMap.map(e => e.card);
            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
            discardEnergy.target = player.active;
            store.reduceEffect(state, discardEnergy);
        }
        return state;
    }
}
exports.HisuianElectrodeV = HisuianElectrodeV;
