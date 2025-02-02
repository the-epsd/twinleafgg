"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Brambleghast = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Brambleghast extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Bramblin';
        this.powers = [{
                name: 'Resilient Soul',
                powerType: game_1.PowerType.ABILITY,
                text: ' This Pokémon gets +50 HP for each Prize card your opponent has taken. '
            }];
        this.attacks = [{
                name: 'Powerful Needles',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 80,
                damageCalculation: 'x',
                text: ' Flip a coin for each Energy attached to this Pokémon. This attack does 80 damage for each heads. '
            }];
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '21';
        this.name = 'Brambleghast';
        this.fullName = 'Brambleghast TEF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckHpEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const prizesTaken = 6 - opponent.getPrizeLeft();
            const hpBoostPerPrize = 50;
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
            if (effect.target.getPokemonCard() === this) {
                effect.hp += prizesTaken * hpBoostPerPrize;
                console.log('hp boost' + (effect.hp));
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            // Check attached energy
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkEnergy);
            const totalEnergy = checkEnergy.energyMap.reduce((sum, energy) => {
                return sum + energy.provides.length;
            }, 0);
            for (let i = 0; i < totalEnergy; i++) {
                store.prompt(state, [
                    new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
                ], result => {
                    if (result === true) {
                        effect.damage += 80;
                    }
                });
            }
            effect.damage -= 80;
            console.log('damage ' + effect.damage);
        }
        return state;
    }
}
exports.Brambleghast = Brambleghast;
