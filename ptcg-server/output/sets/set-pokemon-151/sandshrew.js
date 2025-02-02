"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sandshrew = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Sandshrew extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 60;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.powers = [{
                name: 'Sand Screen',
                powerType: game_1.PowerType.ABILITY,
                text: 'Trainer cards in your opponent\'s discard pile can\'t be put into their deck by an effect of your opponent\'s Item or Supporter cards.'
            }];
        this.attacks = [
            {
                name: 'Scratch',
                cost: [C, C],
                damage: 30,
                text: '',
            }
        ];
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '27';
        this.set = 'MEW';
        this.name = 'Sandshrew';
        this.fullName = 'Sandshrew MEW';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerToDeckEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let isSandshrewInPlay = false;
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isSandshrewInPlay = true;
                }
            });
            if (!isSandshrewInPlay) {
                return state;
            }
            if (isSandshrewInPlay) {
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
exports.Sandshrew = Sandshrew;
