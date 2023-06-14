"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Piplup = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Piplup extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 50;
        this.weakness = [{
                type: card_types_1.CardType.LIGHTNING,
                value: 10
            }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Water Sport',
                cost: [card_types_1.CardType.WATER],
                damage: 10,
                text: 'If Piplup has less Energy attached to it than the Defending ' +
                    'Pokemon, this attack does 10 damage plus 10 more damage.'
            }, {
                name: 'Wavelet',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 40,
                text: 'If you have Buizel in play, this attack does 10 damage to each ' +
                    'of your opponent\'s Benched Pokemon. (Don\'t apply Weakness and ' +
                    'Resistance for Benched Pokemon.)'
            }];
        this.set = 'OP9';
        this.name = 'Piplup';
        this.fullName = 'Piplup OP9';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const playerEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, playerEnergy);
            const opponentEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            state = store.reduceEffect(state, opponentEnergy);
            let playerEnergyCount = 0;
            playerEnergy.energyMap.forEach(e => playerEnergyCount += e.provides.length);
            let opponentEnergyCount = 0;
            opponentEnergy.energyMap.forEach(e => opponentEnergyCount += e.provides.length);
            if (playerEnergyCount < opponentEnergyCount) {
                effect.damage += 10;
            }
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            let isBuizelInPlay = false;
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.name === 'Buizel') {
                    isBuizelInPlay = true;
                }
            });
            if (isBuizelInPlay) {
                opponent.bench.forEach(benched => {
                    if (benched.cards.length > 0) {
                        const dealDamage = new attack_effects_1.PutDamageEffect(effect, 10);
                        dealDamage.target = benched;
                        return store.reduceEffect(state, dealDamage);
                    }
                });
            }
        }
        return state;
    }
}
exports.Piplup = Piplup;
