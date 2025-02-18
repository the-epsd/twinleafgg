"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PalkiaEX = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class PalkiaEX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.POKEMON_EX];
        this.cardType = N;
        this.hp = 180;
        this.weakness = [{ type: N }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Strafe',
                cost: [C, C, C],
                damage: 50,
                text: 'You may switch this Pokémon with 1 of your Benched Pokémon.'
            },
            {
                name: 'Dimension Heal',
                cost: [G, W, C, C],
                damage: 80,
                text: 'Heal from this Pokémon 20 damage for each Plasma Energy attached to this Pokémon.',
            },
        ];
        this.set = 'PLB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '66';
        this.name = 'Palkia EX';
        this.fullName = 'Palkia EX PLB';
        this.usedStrafe = false;
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            this.usedStrafe = true;
        }
        if (prefabs_1.AFTER_ATTACK(effect) && this.usedStrafe) {
            const player = effect.player;
            prefabs_1.SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
            this.usedStrafe = false;
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const pokemon = player.active;
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, pokemon);
            store.reduceEffect(state, checkEnergy);
            let totalPlasmaEnergy = 0;
            checkEnergy.energyMap.forEach(em => {
                const energyCard = em.card;
                if (energyCard instanceof game_1.EnergyCard && energyCard.name === 'Plasma Energy') {
                    totalPlasmaEnergy += 1;
                }
            });
            const healEffect = new game_effects_1.HealEffect(player, player.active, 20 * totalPlasmaEnergy);
            store.reduceEffect(state, healEffect);
        }
        return state;
    }
}
exports.PalkiaEX = PalkiaEX;
