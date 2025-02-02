"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drizzile = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Drizzile extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Sobble';
        this.cardType = game_1.CardType.WATER;
        this.hp = 90;
        this.weakness = [{ type: game_1.CardType.LIGHTNING }];
        this.resistance = [];
        this.retreat = [game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Shady Dealings',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may search your deck for a Trainer card, reveal it, and put it into your hand. Then, shuffle your deck.'
            }];
        this.attacks = [
            {
                name: 'Water Drip',
                cost: [game_1.CardType.WATER, game_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }
        ];
        this.regulationMark = 'D';
        this.set = 'SSH';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '56';
        this.name = 'Drizzile';
        this.fullName = 'Drizzile SSH';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.EvolveEffect && effect.pokemonCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.deck.cards.length === 0) {
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
                    state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: game_1.SuperType.TRAINER }, { min: 0, max: 1, allowCancel: false }), selected => {
                        const cards = selected || [];
                        player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                            if (cardList.getPokemonCard() === this) {
                                cardList.addBoardEffect(game_1.BoardEffect.ABILITY_USED);
                            }
                        });
                        store.prompt(state, [new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards)], () => {
                            player.deck.moveCardsTo(cards, player.hand);
                        });
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
exports.Drizzile = Drizzile;
