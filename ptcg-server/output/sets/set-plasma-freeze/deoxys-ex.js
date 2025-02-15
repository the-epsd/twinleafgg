"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeoxysEX = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class DeoxysEX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = P;
        this.tags = [game_1.CardTag.POKEMON_EX, game_1.CardTag.TEAM_PLASMA];
        this.hp = 170;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Power Connect',
                powerType: game_1.PowerType.ABILITY,
                text: 'Your Team Plasma Pokémon\'s attacks (excluding Deoxys-EX) do 10 more damage to the Active Pokémon (before applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Helix Force',
                cost: [P, C],
                damage: 30,
                damageCalculation: '+',
                text: 'If this Pokémon has any Plasma Energy attached to it, ' +
                    'this attack does 30 more damage for each Energy attached to the Defending Pokémon.'
            }];
        this.set = 'PLF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '53';
        this.name = 'Deoxys EX';
        this.fullName = 'Deoxys EX PLF';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const pokemon = player.active;
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, pokemon);
            const checkOpponentEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent, opponent.active);
            store.reduceEffect(state, checkEnergy);
            let hasPlasmaEnergy = false;
            checkEnergy.energyMap.forEach(em => {
                const energyCard = em.card;
                if (energyCard instanceof game_1.EnergyCard && energyCard.name === 'Plasma Energy') {
                    hasPlasmaEnergy = true;
                }
            });
            if (hasPlasmaEnergy) {
                store.reduceEffect(state, checkOpponentEnergy);
                const opponentEnergyCount = checkOpponentEnergy.energyMap.reduce((left, p) => left + p.provides.length, 0);
                effect.damage += opponentEnergyCount * 30;
            }
        }
        if (effect instanceof attack_effects_1.DealDamageEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            const source = effect.source.getPokemonCard();
            if (state.phase === game_1.GamePhase.ATTACK && game_1.StateUtils.isPokemonInPlay(player, this) &&
                source.tags.includes(game_1.CardTag.TEAM_PLASMA) && source.name !== 'Deoxys EX' &&
                effect.target === opponent.active && effect.damage > 0 && !prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this)) {
                effect.damage += 10;
            }
        }
        return state;
    }
}
exports.DeoxysEX = DeoxysEX;
