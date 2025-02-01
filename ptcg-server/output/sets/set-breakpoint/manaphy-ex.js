"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManaphyEX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class ManaphyEX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 120;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.powers = [{
                name: 'Aqua Tube',
                powerType: game_1.PowerType.ABILITY,
                text: 'Each of your Pokémon that has any [W] Energy attached to it has no Retreat Cost.'
            }];
        this.attacks = [
            {
                name: 'Mineral Pump',
                cost: [W, W],
                damage: 60,
                text: 'Heal 30 damage from each of your Benched Pokémon.'
            }
        ];
        this.set = 'BKP';
        this.setNumber = '32';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Manaphy EX';
        this.fullName = 'Manaphy EX BKP';
    }
    reduceEffect(store, state, effect) {
        // Aqua Tube
        if (effect instanceof check_effects_1.CheckRetreatCostEffect) {
            const player = effect.player;
            let isManaphyOnYourSide = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isManaphyOnYourSide = true;
                }
            });
            if (!isManaphyOnYourSide) {
                return state;
            }
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
            player.active.cards.forEach(card => {
                if (card instanceof game_1.EnergyCard && card.name === 'Water Energy') {
                    effect.cost = [];
                }
            });
        }
        // Mineral Pump
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (cardList === player.active) {
                    return;
                }
                const healing = new attack_effects_1.HealTargetEffect(effect, 30);
                healing.target = cardList;
                store.reduceEffect(state, healing);
            });
        }
        return state;
    }
}
exports.ManaphyEX = ManaphyEX;
