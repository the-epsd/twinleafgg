"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Espeonex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Espeonex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.POKEMON_TERA];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.cardType = P;
        this.hp = 270;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Psych Out',
                cost: [P, C, C],
                damage: 160,
                text: 'Discard 1 random card from your opponent\'s hand.'
            },
            {
                name: 'Amethyst',
                cost: [G, P, D],
                damage: 0,
                text: 'Devolve each of your opponent\'s evolved Pokémon by shuffling the highest Stage Evolution card on it into your opponent’s deck.'
            }
        ];
        this.regulationMark = 'H';
        this.set = 'PRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '34';
        this.name = 'Espeon ex';
        this.fullName = 'Espeon ex SV8a';
    }
    reduceEffect(store, state, effect) {
        // Psych Out
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.hand.cards.length > 0) {
                const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
                const randomCard = opponent.hand.cards[randomIndex];
                opponent.hand.moveCardTo(randomCard, opponent.discard);
            }
        }
        // Amethyst
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card.stage === card_types_1.Stage.STAGE_1 || card.stage === card_types_1.Stage.STAGE_2) {
                    const pokemons = cardList.getPokemons();
                    const latestEvolution = pokemons.slice(-1)[0];
                    cardList.moveCardsTo([latestEvolution], opponent.deck);
                    cardList.clearEffects();
                }
            });
            return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
            });
        }
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Target is not Active
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            // Target is this Pokemon
            if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
                effect.preventDefault = true;
            }
        }
        return state;
    }
}
exports.Espeonex = Espeonex;
