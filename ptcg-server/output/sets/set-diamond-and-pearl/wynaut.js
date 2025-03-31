"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wynaut = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Wynaut extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 40;
        this.weakness = [{ type: P, value: +10 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Baby Evolution',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may put Wobbuffet from your hand onto Wynaut (this counts as evolving Wynaut) and remove all damage counters from Wynaut.'
            }];
        this.attacks = [
            {
                name: 'Astonish',
                cost: [],
                damage: 0,
                text: 'Choose 1 card from your opponent\'s hand without looking. Look at the card you chose, then have your opponent shuffle that card into his or her deck.'
            }
        ];
        this.set = 'DP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '42';
        this.name = 'Wynaut';
        this.fullName = 'Wynaut DP';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            const hasWobbuffet = player.hand.cards.some(card => card instanceof pokemon_card_1.PokemonCard && card.name === 'Wobbuffet');
            // Check if Wobbuffet is in the player's hand
            if (!hasWobbuffet) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Blocking pokemon cards, that cannot be valid evolutions
            const blocked = [];
            player.hand.cards.forEach((card, index) => {
                if (card instanceof pokemon_card_1.PokemonCard && card.name !== 'Wobbuffet') {
                    blocked.push(index);
                }
            });
            let selectedCards = [];
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.hand, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: true, blocked }), selected => {
                selectedCards = selected || [];
                const evolution = selectedCards[0];
                const target = game_1.StateUtils.findCardList(state, this);
                // Evolve Pokemon
                player.hand.moveCardTo(evolution, target);
                const pokemonTarget = target;
                pokemonTarget.clearEffects();
                pokemonTarget.pokemonPlayedTurn = state.turn;
                // Heal all damage from the evolved Pokemon
                const healEffect = new game_effects_1.HealEffect(player, pokemonTarget, pokemonTarget.damage);
                store.reduceEffect(state, healEffect);
                return state;
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.hand.cards.length === 0) {
                return state;
            }
            if (opponent.hand.cards.length > 0) {
                const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
                const randomCard = opponent.hand.cards[randomIndex];
                store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, [randomCard]), () => []);
                opponent.hand.moveCardsTo([randomCard], opponent.deck);
                return store.prompt(state, new game_1.ShuffleDeckPrompt(opponent.id), order => {
                    opponent.deck.applyOrder(order);
                });
            }
        }
        return state;
    }
}
exports.Wynaut = Wynaut;
