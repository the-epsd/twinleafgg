"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pelipper = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Pelipper extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Wingull';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Hearsay',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may choose 1: put a Supporter card from your discard pile into your hand; or search your deck for a Supporter card, reveal it, put it into your hand, and then shuffle your deck. '
            }];
        this.attacks = [{
                name: 'Wing Attack',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 90,
                text: ''
            }];
        this.set = 'PAL';
        this.setNumber = '159';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Pelipper';
        this.fullName = 'Pelipper PAL';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // if (player.deck.cards.length === 0) {
            //   return state;
            // }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: pokemon_types_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            const options = [
                {
                    message: game_1.GameMessage.CHOOSE_SUPPORTER_FROM_DISCARD,
                    action: () => {
                        const hasSupporter = player.discard.cards.some(c => {
                            return c instanceof game_1.TrainerCard && c.trainerType === card_types_1.TrainerType.SUPPORTER;
                        });
                        if (!hasSupporter) {
                            throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
                        }
                        let cards = [];
                        return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { min: 1, max: 1, allowCancel: true }), selected => {
                            cards = selected || [];
                            if (cards.length > 0) {
                                store.prompt(state, [new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards)], () => {
                                    player.discard.moveCardsTo(cards, player.hand);
                                });
                            }
                            return state;
                        });
                    }
                },
                {
                    message: game_1.GameMessage.CHOOSE_SUPPORTER_FROM_DECK,
                    action: () => {
                        return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { min: 0, max: 1, allowCancel: false }), selected => {
                            const cards = selected || [];
                            store.prompt(state, [new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards)], () => {
                                player.deck.moveCardsTo(cards, player.hand);
                            });
                            return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                                player.deck.applyOrder(order);
                            });
                        });
                    }
                }
            ];
            return store.prompt(state, new game_1.SelectPrompt(player.id, game_1.GameMessage.CHOOSE_OPTION, options.map(opt => opt.message), { allowCancel: false }), choice => {
                const option = options[choice];
                option.action();
            });
        }
        return state;
    }
}
exports.Pelipper = Pelipper;
