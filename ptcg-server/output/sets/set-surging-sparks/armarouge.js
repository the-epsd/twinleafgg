"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Armarouge = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
class Armarouge extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Charcadet';
        this.cardType = R;
        this.hp = 140;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Combustion',
                cost: [C, C],
                damage: 50,
                text: ''
            },
            {
                name: 'Crimson Blaster',
                cost: [R, R, C],
                damage: 0,
                text: 'Discard all [R] Energy from this Pokémon, and this attack does 180 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
        ];
        this.set = 'SSP';
        this.regulationMark = 'H';
        this.setNumber = '34';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Armarouge';
        this.fullName = 'Armarouge SSP';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const fireEnergy = player.active.cards.filter(card => card instanceof game_1.EnergyCard && card.name === 'Fire Energy');
            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, fireEnergy);
            discardEnergy.target = player.active;
            store.reduceEffect(state, discardEnergy);
            attack_effects_2.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(180, effect, store, state);
        }
        return state;
    }
}
exports.Armarouge = Armarouge;
