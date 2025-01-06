"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HopsDubwool = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class HopsDubwool extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.HOPS, card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Hop\'s Wooloo';
        this.cardType = C;
        this.hp = 120;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Challenge Horn',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may switch in 1 of your opponent\'s Benched Pokémon to the Active Spot.'
            }];
        this.attacks = [{
                name: 'Headbutt',
                cost: [C, C, C],
                damage: 80,
                text: ''
            }
        ];
        this.regulationMark = 'I';
        this.set = 'SV9';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '86';
        this.name = 'Hop\'s Dubwool';
        this.fullName = 'Hop\'s Dubwool SV9';
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
                    const player = effect.player;
                    const opponent = game_1.StateUtils.getOpponent(state, player);
                    const hasBench = opponent.bench.some(b => b.cards.length > 0);
                    if (!hasBench) {
                        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
                    }
                    return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                        const cardList = result[0];
                        opponent.switchPokemon(cardList);
                        return state;
                    });
                }
                else {
                    return state;
                }
            });
        }
        return state;
    }
}
exports.HopsDubwool = HopsDubwool;
