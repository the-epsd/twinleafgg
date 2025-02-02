"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Galvantula = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Galvantula extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Joltik';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Compound Eyes',
                powerType: game_1.PowerType.ABILITY,
                text: 'This Pokémon\'s attacks do 50 more damage to your opponent\'s Active Pokémon that have an Ability.'
            }];
        this.attacks = [{
                name: 'Shocking Web',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: 'If this Pokémon has any [L] Energy attached, this attack does 80 more damage.'
            }];
        this.regulationMark = 'H';
        this.set = 'SFA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '2';
        this.name = 'Galvantula';
        this.fullName = 'Galvantula SFA';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActive = opponent.active.getPokemonCard();
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            if (opponentActive && opponentActive.powers.length > 0) {
                effect.damage += 50;
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const pokemon = player.active;
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, pokemon);
            store.reduceEffect(state, checkEnergy);
            let damage = 50;
            checkEnergy.energyMap.forEach(em => {
                const energyCard = em.card;
                if (energyCard instanceof game_1.EnergyCard && energyCard.provides.includes(card_types_1.CardType.LIGHTNING)) {
                    damage += 80;
                }
            });
            effect.damage = damage;
        }
        return state;
    }
}
exports.Galvantula = Galvantula;
