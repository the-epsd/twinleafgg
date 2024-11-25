"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reuniclus = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Reuniclus extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Duosion';
        this.regulationMark = 'H';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Summoning Gate',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Look at the top 8 cards of your deck and put any number of Pokémon you find there onto your Bench. Shuffle the other cards into your deck.'
            },
            {
                name: 'Brain Shake',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 100,
                text: 'Your opponent\'s Active Pokémon is now Confused.'
            }
        ];
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '72';
        this.name = 'Reuniclus';
        this.fullName = 'Reuniclus TEF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let pokemons = 0;
            const blocked = [];
            player.deck.cards.forEach((c, index) => {
                if (c instanceof pokemon_card_1.PokemonCard) {
                    pokemons += 1;
                }
                else {
                    blocked.push(index);
                }
            });
            // Allow player to search deck and choose up to 2 Basic Pokemon
            const slots = player.bench.filter(b => b.cards.length === 0);
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            else {
                // Check if bench has open slots
                const openSlots = player.bench.filter(b => b.cards.length === 0);
                if (openSlots.length === 0) {
                    // No open slots, throw error
                    throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
                }
                const maxPokemons = Math.min(pokemons, 8);
                const deckTop = new game_1.CardList();
                player.deck.moveTo(deckTop, 8);
                // We will discard this card after prompt confirmation
                effect.preventDefault = true;
                let cards = [];
                return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, deckTop, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 8, allowCancel: false, blocked, maxPokemons }), selectedCards => {
                    cards = selectedCards || [];
                    cards.forEach((card, index) => {
                        deckTop.moveCardTo(card, slots[index]);
                        slots[index].pokemonPlayedTurn = state.turn;
                        deckTop.moveTo(player.deck);
                    });
                    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                        return state;
                    });
                });
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.CONFUSED]);
            store.reduceEffect(state, specialConditionEffect);
        }
        return state;
    }
}
exports.Reuniclus = Reuniclus;
