"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EldegossV = void 0;
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
class EldegossV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.regulationMark = 'D';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 190;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Happy Match',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand onto your Bench during your turn, you may put a Supporter card from your discard pile into your hand.'
            }];
        this.attacks = [
            {
                name: 'Float Up',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: 'You may shuffle this Pokémon and all attached cards into your deck.'
            }
        ];
        this.set = 'CPA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '5';
        this.name = 'Eldegoss V';
        this.fullName = 'Eldegoss V CPA';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasSupporterInDiscard = player.discard.cards.some(c => {
                return c instanceof game_1.TrainerCard
                    && c.trainerType === card_types_1.TrainerType.SUPPORTER;
            });
            if (!hasSupporterInDiscard) {
                return state;
            }
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
                            store.log(state, game_1.GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, ability: 'Happy Match' });
                        }
                    });
                    state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { min: 1, max: 1, allowCancel: false }), selected => {
                        const cards = selected || [];
                        if (cards.length > 0) {
                            store.prompt(state, [new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards)], () => {
                                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                                    if (cardList.getPokemonCard() === this) {
                                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                                    }
                                });
                                cards.forEach((card, index) => {
                                    store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                                });
                                player.discard.moveCardsTo(cards, player.hand);
                            });
                        }
                    });
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            player.active.clearEffects();
            player.active.moveTo(player.deck);
            return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
            });
        }
        return state;
    }
}
exports.EldegossV = EldegossV;
