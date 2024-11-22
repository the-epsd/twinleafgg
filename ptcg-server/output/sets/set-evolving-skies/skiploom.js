"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skiploom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Skiploom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Hoppip';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.powers = [{
                name: 'Solar Evolution',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you attach an Energy card from your hand to this Pokémon during your turn,'
                    + ' you may search your deck for a card that evolves from this Pokémon and put it onto this Pokémon to evolve it.'
                    + 'Then, shuffle your deck.'
            }];
        this.attacks = [{
                name: 'Spinning Attack',
                cost: [card_types_1.CardType.GRASS],
                damage: 20,
                text: ''
            }];
        this.set = 'EVS';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '3';
        this.name = 'Skiploom';
        this.fullName = 'Skiploom EVS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.target.getPokemons().some(card => card === this)) {
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
            if (player.deck.cards.length === 0) {
                return state;
            }
            return store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    let cards = [];
                    state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.STAGE_2, evolvesFrom: 'Skiploom' }, { min: 1, max: 1, allowCancel: true }), selected => {
                        cards = selected || [];
                        if (cards.length > 0) {
                            if (effect.target.cards === player.active.cards) {
                                // Evolve Pokemon
                                player.deck.moveCardsTo(cards, player.active);
                                player.active.clearEffects();
                                player.active.pokemonPlayedTurn = state.turn;
                            }
                            else {
                                const benchIndex = player.bench.indexOf(effect.target);
                                player.deck.moveCardsTo(cards, player.bench[benchIndex]);
                                player.bench[benchIndex].clearEffects();
                                player.bench[benchIndex].pokemonPlayedTurn = state.turn;
                            }
                        }
                        return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                            player.deck.applyOrder(order);
                        });
                    });
                }
            });
        }
        return state;
    }
}
exports.Skiploom = Skiploom;
