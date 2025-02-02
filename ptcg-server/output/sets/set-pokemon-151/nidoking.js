"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nidoking = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Nidoking extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Nidorino';
        this.cardType = game_1.CardType.DARK;
        this.hp = 170;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Enthusiastic King',
                powerType: game_1.PowerType.ABILITY,
                text: 'If you have Nidoqueen in play, ignore all Energy in the costs of attacks used by this Pokémon.'
            }];
        this.attacks = [{
                name: 'Venomous Impact',
                cost: [game_1.CardType.DARK, game_1.CardType.DARK, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 190,
                text: 'Your opponent\'s Active Pokémon is now Poisoned.'
            }];
        this.set = 'MEW';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '34';
        this.name = 'Nidoking';
        this.fullName = 'Nidoking MEW';
    }
    getColorlessReduction(state) {
        const player = game_1.StateUtils.findOwner(state, this.cards);
        const hasNidoqueen = player.bench.some(b => b.cards[0].name === 'Nidoqueen');
        return hasNidoqueen ? 2 : 0;
    }
    getDarkReduction(state) {
        const player = game_1.StateUtils.findOwner(state, this.cards);
        const hasNidoqueen = player.bench.some(b => b.cards[0].name === 'Nidoqueen');
        return hasNidoqueen ? 2 : 0;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let hasNidoqueen = false;
            player.bench.forEach(benchSpot => {
                var _a;
                if (((_a = benchSpot.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name) == 'Nidoqueen') {
                    hasNidoqueen = true;
                }
            });
            if (hasNidoqueen) {
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
                const costToRemove = 4;
                for (let i = 0; i < costToRemove; i++) {
                    let index = effect.cost.indexOf(game_1.CardType.COLORLESS);
                    if (index !== -1) {
                        effect.cost.splice(index, 1);
                    }
                    else {
                        index = effect.cost.indexOf(game_1.CardType.DARK);
                        if (index !== -1) {
                            effect.cost.splice(index, 1);
                        }
                    }
                    console.log(effect.cost);
                }
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.addSpecialCondition(game_1.SpecialCondition.POISONED);
        }
        return state;
    }
}
exports.Nidoking = Nidoking;
