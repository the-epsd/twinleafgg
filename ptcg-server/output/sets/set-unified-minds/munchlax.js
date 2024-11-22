"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Munchlax = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Munchlax extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 60;
        this.powers = [{
                name: 'Snack Search',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: ' Once during your turn (before your attack), you may flip a coin.'
                    + 'If heads, put a card from your discard pile on top of your deck. If you use this Ability, your turn ends. '
            }];
        this.set = 'UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '173';
        this.name = 'Munchlax';
        this.fullName = 'Munchlax UNM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let cards = [];
            if (player.discard.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Checking to see if ability is being blocked
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
            store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result) {
                    const deckTop = new game_1.CardList();
                    store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARDS_TO_PUT_ON_TOP_OF_THE_DECK, player.discard, {}, { min: 1, max: 1, allowCancel: false }), selected => {
                        cards = selected || [];
                        player.discard.moveCardsTo(cards, deckTop);
                        deckTop.moveToTopOfDestination(player.deck);
                        if (cards.length > 0) {
                            return store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => {
                                return state;
                            });
                        }
                        player.deck.moveCardsTo(cards, deckTop);
                    });
                }
            });
            const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
            store.reduceEffect(state, endTurnEffect);
            return state;
        }
        return state;
    }
}
exports.Munchlax = Munchlax;
