"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CastformRainyForm = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class CastformRainyForm extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'E';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [];
        this.retreat = [];
        this.powers = [
            {
                name: 'Weather Reading',
                text: 'If you have 8 or more Stadium cards in your discard pile, ignore all Energy in this Pokémon\'s attack costs.',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: false,
            }
        ];
        this.attacks = [{
                name: 'Rainfall',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'This attack does 20 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '33';
        this.name = 'Castform Rainy Form';
        this.fullName = 'Castform Rainy Form CRE';
    }
    getColorlessReduction(state) {
        const player = state.players[state.activePlayer];
        const stadiumsInDiscard = player.discard.cards.filter(c => c instanceof game_1.TrainerCard && c.trainerType === card_types_1.TrainerType.STADIUM).length;
        return stadiumsInDiscard >= 8 ? 2 : 0;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckAttackCostEffect) {
            const player = effect.player;
            const stadiumsInDiscard = player.discard.cards.filter(c => c instanceof game_1.TrainerCard && c.trainerType === card_types_1.TrainerType.STADIUM).length;
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
            if (stadiumsInDiscard >= 8) {
                const costToRemove = 2;
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
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const opponent = effect.opponent;
            const benched = opponent.bench.filter(b => b.cards.length > 0);
            const activeDamageEffect = new attack_effects_1.DealDamageEffect(effect, 20);
            store.reduceEffect(state, activeDamageEffect);
            benched.forEach(target => {
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
                damageEffect.target = target;
                store.reduceEffect(state, damageEffect);
            });
        }
        return state;
    }
}
exports.CastformRainyForm = CastformRainyForm;
