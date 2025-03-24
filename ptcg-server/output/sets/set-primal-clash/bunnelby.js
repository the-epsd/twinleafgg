"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bunnelby = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
class Bunnelby extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Barrage',
                powerType: pokemon_types_1.PowerType.ANCIENT_TRAIT,
                barrage: true,
                text: 'This Pokémon may attack twice a turn. (If the first attack Knocks Out your opponent\'s Active Pokémon, you may attack again after your opponent chooses a new Active Pokémon.)'
            }];
        this.attacks = [{
                name: 'Burrow',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Discard the top card of your opponent\'s deck.'
            }, {
                name: 'Rototiller',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Shuffle a card from your discard pile into your deck.'
            }];
        this.set = 'PRC';
        this.name = 'Bunnelby';
        this.fullName = 'Bunnelby PRC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '121';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            opponent.deck.moveTo(opponent.discard, 1);
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            if (player.discard.cards.length > 0) {
                state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, {}, { min: 1, max: 1, allowCancel: false }), selected => {
                    const cards = selected || [];
                    store.prompt(state, [new game_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards)], () => {
                        player.discard.moveCardsTo(cards, player.deck);
                    });
                    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                    });
                });
            }
        }
        return state;
    }
}
exports.Bunnelby = Bunnelby;
