"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swoobat = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Swoobat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Woobat';
        this.cardType = P;
        this.hp = 80;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Jet Woofer',
                cost: [P],
                damage: 0,
                text: 'For each [P] Energy attached to this Pokémon, discard the top card of your opponent\'s deck.'
            },
            {
                name: 'Acrobatics',
                cost: [C, C],
                damage: 20,
                damageCalculation: '+',
                text: 'Flip 2 coins. This attack does 20 more damage for each heads.'
            }];
        this.set = 'BCR';
        this.setNumber = '71';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Swoobat';
        this.fullName = 'Swoobat BCR';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            const totalPsychicEnergy = checkProvidedEnergy.energyMap.reduce((sum, energy) => {
                return sum + energy.provides.filter(type => type === card_types_1.CardType.PSYCHIC || type === card_types_1.CardType.ANY).length;
            }, 0);
            opponent.deck.moveTo(opponent.discard, totalPsychicEnergy);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
            ], results => {
                let heads = 0;
                results.forEach(r => { heads += r ? 1 : 0; });
                effect.damage += 20 * heads;
            });
        }
        return state;
    }
}
exports.Swoobat = Swoobat;
