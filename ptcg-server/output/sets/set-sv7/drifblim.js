"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drifblim = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Drifblim extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.cardType = game_1.CardType.PSYCHIC;
        this.hp = 130;
        this.weakness = [{ type: game_1.CardType.DARK }];
        this.resistance = [{ type: game_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.evolvesFrom = 'Drifloon';
        this.attacks = [{
                name: 'Everyone Explode Now',
                cost: [game_1.CardType.PSYCHIC],
                damage: 50,
                damageCalculation: 'x',
                text: 'This attack does 50 damage for each of your Drifloon and Drifblim in play. This attack also does 30 damage to each of your Drifloon and Drifblim. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.regulationMark = 'H';
        this.set = 'SCR';
        this.name = 'Drifblim';
        this.fullName = 'Drifblim SV7';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '61';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let drifloonInPlay = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (card.name === 'Drifloon') {
                    drifloonInPlay++;
                }
            });
            let drifblimInPlay = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (card.name === 'Drifblim') {
                    drifblimInPlay++;
                }
            });
            const damage = drifloonInPlay + drifblimInPlay;
            effect.damage = 50 * damage;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card && card.name === 'Drifloon') {
                    cardList.damage += 30;
                }
            });
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card && card.name === 'Drifblim') {
                    cardList.damage += 30;
                }
            });
        }
        return state;
    }
}
exports.Drifblim = Drifblim;
