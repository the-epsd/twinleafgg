"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exeggutor = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Exeggutor extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Exeggcute';
        this.attacks = [{
                name: 'Teleport',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 0,
                text: 'Switch Exeggutor with 1 of your Benched Pokémon.'
            },
            {
                name: 'Big Eggsplosion',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                damageCalculation: 'x',
                text: 'Flip a number of coins equal to the number of Energy attached to Exeggutor. This attack does 20 damage times the number of heads.'
            }];
        this.set = 'JU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '35';
        this.name = 'Exeggutor';
        this.fullName = 'Exeggutor JU';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_NEW_ACTIVE_POKEMON, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), selected => {
                if (!selected || selected.length === 0) {
                    return state;
                }
                const target = selected[0];
                player.switchPokemon(target);
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            // Check attached energy
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkEnergy);
            const totalEnergy = checkEnergy.energyMap.reduce((sum, energy) => {
                return sum + energy.provides.length;
            }, 0);
            effect.damage = 0;
            for (let i = 0; i < totalEnergy; i++) {
                store.prompt(state, [
                    new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
                ], result => {
                    if (result) {
                        effect.damage += 80;
                    }
                });
            }
        }
        return state;
    }
}
exports.Exeggutor = Exeggutor;
