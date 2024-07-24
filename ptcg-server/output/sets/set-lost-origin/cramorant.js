"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cramorant = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Cramorant extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'F';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Lost Provisions',
                powerType: game_1.PowerType.ABILITY,
                text: 'If you have 4 or more cards in the Lost Zone, ignore all Energy in this Pokémon\'s attack costs.'
            }];
        this.attacks = [
            {
                name: 'Spit Innocently',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 110,
                text: 'This attack\'s damage isn\'t affected by Weakness.'
            }
        ];
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '50';
        this.name = 'Cramorant';
        this.fullName = 'Cramorant LOR';
    }
    getColorlessReduction(state) {
        const player = game_1.StateUtils.findOwner(state, this.cards);
        return player.lostzone.cards.length >= 4 ? 3 : 0;
    }
    getWaterReduction(state) {
        const player = game_1.StateUtils.findOwner(state, this.cards);
        return player.lostzone.cards.length >= 4 ? 3 : 0;
    }
    reduceEffect(store, state, effect) {
        // if (effect instanceof UseAttackEffect && effect.attack === this.attacks[0]) {
        //   const player = effect.player;
        //   if (player.lostzone.cards.length <= 3) {
        //     return state;
        //   }
        //   if (player.lostzone.cards.length >= 4) {
        //     try {
        //       const stub = new PowerEffect(player, {
        //         name: 'test',
        //         powerType: PowerType.ABILITY,
        //         text: ''
        //       }, this);
        //       store.reduceEffect(state, stub);
        //     } catch {
        //       return state;
        //     }
        //     this.attacks.forEach(attack => {
        //       attack.cost = [];
        //     });
        //     return state;
        //   }
        // }
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                console.log(effect.cost);
                return state;
            }
            const lostZoneCount = player.lostzone.cards.length;
            if (lostZoneCount >= 4) {
                const costToRemove = 3;
                for (let i = 0; i < costToRemove; i++) {
                    let index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                    if (index !== -1) {
                        effect.cost.splice(index, 1);
                    }
                    else {
                        index = effect.cost.indexOf(card_types_1.CardType.WATER);
                        if (index !== -1) {
                            effect.cost.splice(index, 1);
                        }
                    }
                }
            }
            console.log(effect.cost);
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            effect.ignoreWeakness = true;
        }
        return state;
    }
}
exports.Cramorant = Cramorant;
