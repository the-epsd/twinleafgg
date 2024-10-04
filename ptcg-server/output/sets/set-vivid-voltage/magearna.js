"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magearna = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Magearna extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Overhaul',
                cost: [card_types_1.CardType.METAL],
                damage: 0,
                text: 'Shuffle your hand into your deck. Then, draw 6 cards.'
            },
            {
                name: 'Windup Cannon',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS],
                damage: 10,
                text: 'This attack does 20 more damage for each of your opponent\'s Benched Pokémon.'
            }];
        this.set = 'VIV';
        this.regulationMark = 'D';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '128';
        this.name = 'Magearna';
        this.fullName = 'Magearna VIV';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            player.hand.moveTo(player.deck);
            return store.prompt(state, [
                new game_1.ShuffleDeckPrompt(player.id)
            ], deckOrder => {
                player.deck.applyOrder(deckOrder);
                player.deck.moveTo(player.hand, 6);
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentBenched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            effect.damage += 20 * opponentBenched;
        }
        return state;
    }
}
exports.Magearna = Magearna;
