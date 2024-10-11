"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toedscruel = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Toedscruel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Toedscool';
        this.cardType = G;
        this.hp = 120;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Slime Mold Colony',
                powerType: game_1.PowerType.ABILITY,
                text: 'Cards in your opponent\'s discard pile can\'t be put into their hand by an effect of your opponent\'s Abilities or Trainer cards.'
            }];
        this.attacks = [
            {
                name: 'Scratch',
                cost: [G, C, C],
                damage: 80,
                text: 'Heal 30 damage from this Pokémon.',
            }
        ];
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '17';
        this.set = 'PAR';
        this.name = 'Toedscruel';
        this.fullName = 'Toedscruel PAR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.DiscardToHandEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let isToedscruelInPlay = false;
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isToedscruelInPlay = true;
                }
            });
            if (!isToedscruelInPlay) {
                return state;
            }
            if (isToedscruelInPlay) {
                // Try to reduce PowerEffect, to check if something is blocking our ability
                try {
                    const stub = new game_effects_1.PowerEffect(opponent, {
                        name: 'test',
                        powerType: game_1.PowerType.ABILITY,
                        text: ''
                    }, this);
                    store.reduceEffect(state, stub);
                }
                catch (_a) {
                    return state;
                }
                effect.preventDefault = true;
            }
        }
        return state;
    }
}
exports.Toedscruel = Toedscruel;
