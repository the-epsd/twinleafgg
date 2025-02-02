"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Oricorio = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Oricorio extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.powers = [{
                name: 'Vital Dance',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand onto your Bench during your turn, you may search your deck for up to 2 basic Energy cards, reveal them, and put them into your hand. Then, shuffle your deck.'
            }];
        this.attacks = [{
                name: 'Casual Slap',
                cost: [P, C],
                damage: 30,
                text: ''
            }];
        this.set = 'GRI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '55';
        this.name = 'Oricorio';
        this.fullName = 'Oricorio GRI';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
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
            let cards = [];
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC }, { min: 0, max: 2, allowCancel: false }), selected => {
                        cards = selected || [];
                        cards.forEach((card, index) => {
                            store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                        });
                        if (cards.length > 0) {
                            store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => state);
                        }
                        player.deck.moveCardsTo(cards, player.hand);
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
exports.Oricorio = Oricorio;
