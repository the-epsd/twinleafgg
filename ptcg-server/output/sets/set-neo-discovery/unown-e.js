"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnwonE = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class UnwonE extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 40;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.powers = [{
                name: 'Engage',
                powerType: game_1.PowerType.POKEMON_POWER,
                text: 'When you play Unown E from your hand, your opponent may shuffle his or her hand into his or her deck and then draw 4 cards. Either way, you may shuffle your hand into your deck and draw 4 cards.'
            }];
        this.attacks = [{
                name: 'Hidden Power',
                cost: [P],
                damage: 10,
                text: ''
            }];
        this.set = 'N2';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '67';
        this.name = 'Unown E';
        this.fullName = 'Unown E N2';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this && !prefabs_1.IS_POKEMON_POWER_BLOCKED(store, state, effect.player, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Opponent chooses first
            state = store.prompt(state, new game_1.ConfirmPrompt(opponent.id, game_1.GameMessage.WANT_TO_USE_ABILITY), opponentWantsToShuffle => {
                if (opponentWantsToShuffle) {
                    opponent.hand.moveTo(opponent.deck);
                    state = store.prompt(state, new game_1.ShuffleDeckPrompt(opponent.id), deckOrder => {
                        opponent.deck.applyOrder(deckOrder);
                        opponent.deck.moveTo(opponent.hand, 4);
                    });
                }
                // Then player chooses
                state = store.prompt(state, new game_1.ConfirmPrompt(player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), playerWantsToShuffle => {
                    if (playerWantsToShuffle) {
                        const cards = player.hand.cards.filter(c => c !== this);
                        player.hand.moveCardsTo(cards, player.deck);
                        state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), deckOrder => {
                            player.deck.applyOrder(deckOrder);
                            player.deck.moveTo(player.hand, 4);
                        });
                    }
                });
            });
        }
        return state;
    }
}
exports.UnwonE = UnwonE;
