"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArvensGreedent = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class ArvensGreedent extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'I';
        this.tags = [card_types_1.CardTag.ARVENS];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Arven\'s Skwovet';
        this.cardType = F;
        this.hp = 120;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Greedy Order',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may put up to 2 Arven\'s Sandwich from your discard pile into your hand.'
            }];
        this.attacks = [{
                name: 'Rolling Tackle',
                cost: [C, C],
                damage: 50,
                text: ''
            }];
        this.set = 'SV9a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '55';
        this.name = 'Arven\'s Greedent';
        this.fullName = 'Arven\'s Greedent SV9a';
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
            // if there's no sandwiches in the discard, just skip this
            let sandwiches = false;
            player.discard.cards.forEach(card => {
                if (card.name === 'Arven\'s Sandwich') {
                    sandwiches = true;
                }
            });
            if (!sandwiches) {
                return state;
            }
            state = store.prompt(state, new game_1.ConfirmPrompt(player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.TRAINER, name: 'Arven\'s Sandwich' }, { min: 0, max: 2, allowCancel: false }), cards => {
                        if (cards.length > 0) {
                            return state;
                        }
                        prefabs_1.MOVE_CARDS_TO_HAND(store, state, player, cards);
                    });
                }
            });
        }
        return state;
    }
}
exports.ArvensGreedent = ArvensGreedent;
