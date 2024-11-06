"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spritzee = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Spritzee extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = Y;
        this.hp = 50;
        this.weakness = [{ type: M }];
        this.resistance = [{ type: D, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Sweet Scent',
                cost: [Y],
                damage: 0,
                text: 'Heal 20 damage from 1 of your Pokémon.'
            },
            {
                name: 'Flop',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'XY';
        this.name = 'Spritzee';
        this.fullName = 'Spritzee XY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '92';
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
                    const healEffect = new game_effects_1.HealEffect(player, target, 20);
                    store.reduceEffect(state, healEffect);
                });
                return state;
            });
        }
        return state;
    }
}
exports.Spritzee = Spritzee;
