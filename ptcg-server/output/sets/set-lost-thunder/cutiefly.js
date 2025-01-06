"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cutiefly = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Cutiefly extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = Y;
        this.hp = 30;
        this.weakness = [{ type: M }];
        this.resistance = [{ type: D, value: -20 }];
        this.attacks = [{
                name: 'Sweet Scent',
                cost: [C],
                damage: 0,
                text: 'Heal 30 damage from 1 of your Pokémon.'
            }];
        this.set = 'LOT';
        this.name = 'Cutiefly';
        this.fullName = 'Cutiefly LOT';
        this.setNumber = '145';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const blocked = [];
            let hasPokemonWithDamage = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList.damage === 0) {
                    blocked.push(target);
                }
                else {
                    hasPokemonWithDamage = true;
                }
            });
            if (hasPokemonWithDamage === false) {
                return state;
            }
            // Do not discard the card yet
            effect.preventDefault = true;
            let targets = [];
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_HEAL, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked }), results => {
                targets = results || [];
                if (targets.length === 0) {
                    return state;
                }
                targets.forEach(target => {
                    // Heal Pokemon
                    const healEffect = new game_effects_1.HealEffect(player, target, 30);
                    store.reduceEffect(state, healEffect);
                });
                return state;
            });
        }
        return state;
    }
}
exports.Cutiefly = Cutiefly;
