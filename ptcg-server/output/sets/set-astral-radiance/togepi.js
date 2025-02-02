"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Togepi = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Togepi extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 50;
        this.weakness = [{ type: M }];
        this.resistance = [];
        this.retreat = [C];
        this.powers = [
            {
                name: 'Touch of Happiness',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand onto your Bench during your turn, you may heal 10 damage from your Active Pokémon.'
            }
        ];
        this.attacks = [
            {
                name: 'Rollout',
                cost: [P],
                damage: 10,
                text: ''
            }
        ];
        this.regulationMark = 'H';
        this.set = 'ASR';
        this.setNumber = '55';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Togepi';
        this.fullName = 'Togepi ASR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            // Try to reduce PowerEffect, to check if something is blocking our ability
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
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                        if (cardList.getPokemonCard() === this) {
                            store.log(state, game_1.GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, ability: 'Touch of Happiness' });
                        }
                    });
                    const healEffect = new game_effects_1.HealEffect(player, effect.player.active, 30);
                    store.reduceEffect(state, healEffect);
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                        if (cardList.getPokemonCard() === this) {
                            cardList.addBoardEffect(game_1.BoardEffect.ABILITY_USED);
                        }
                    });
                }
            });
        }
        return state;
    }
}
exports.Togepi = Togepi;
