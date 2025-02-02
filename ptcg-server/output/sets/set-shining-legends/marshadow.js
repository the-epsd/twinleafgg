"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Marshadow = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Marshadow extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Let Loose',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand onto your Bench during your turn, you may have each player shuffle their hand into their deck and draw 4 cards.'
            }];
        this.attacks = [{
                name: 'Shadow Punch',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'This attack\'s damage isn\'t affected by Resistance.'
            }];
        this.set = 'SLG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '45';
        this.name = 'Marshadow';
        this.fullName = 'Marshadow SLG';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
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
                    const cards = player.hand.cards.filter(c => c !== this);
                    player.hand.moveCardsTo(cards, player.deck);
                    opponent.hand.moveTo(opponent.deck);
                    store.prompt(state, [
                        new game_1.ShuffleDeckPrompt(player.id),
                        new game_1.ShuffleDeckPrompt(opponent.id)
                    ], deckOrder => {
                        player.deck.applyOrder(deckOrder[0]);
                        opponent.deck.applyOrder(deckOrder[1]);
                        player.deck.moveTo(player.hand, 4);
                        opponent.deck.moveTo(opponent.hand, 4);
                    });
                }
                return state;
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            effect.ignoreResistance = true;
        }
        return state;
    }
}
exports.Marshadow = Marshadow;
