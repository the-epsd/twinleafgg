"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tatsugiriex = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Tatsugiriex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'H';
        this.cardType = N;
        this.hp = 160;
        this.weakness = [];
        this.resistance = [];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Surprise Pump',
                cost: [F, W],
                damage: 100,
                text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
            },
            {
                name: 'Cinnabar Lure',
                cost: [],
                // cost: [F, W, D],
                damage: 0,
                text: 'Look at the top 10 cards of your deck. You may put any number of Pokémon you find there onto your Bench. Shuffle the other cards back into your deck.'
            }
        ];
        this.set = 'SV8';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '81';
        this.name = 'Tatsugiri ex';
        this.fullName = 'Tatsugiri ex SV8';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const applyWeakness = new attack_effects_1.ApplyWeaknessEffect(effect, 100);
            store.reduceEffect(state, applyWeakness);
            const damage = applyWeakness.damage;
            effect.damage = 0;
            if (damage > 0) {
                opponent.active.damage += damage;
                const afterDamage = new attack_effects_1.AfterDamageEffect(effect, damage);
                state = store.reduceEffect(state, afterDamage);
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            // Allow player to search deck and choose up to 2 Basic Pokemon
            const slots = player.bench.filter(b => b.cards.length === 0);
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Check if bench has open slots
            const openSlots = player.bench.filter(b => b.cards.length === 0);
            if (openSlots.length === 0) {
                // No open slots, throw error
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Set maxPokemons to number of open slots
            const maxPokemons = openSlots.length;
            const deckTop = new game_1.CardList();
            player.deck.moveTo(deckTop, 8);
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, deckTop, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: maxPokemons, allowCancel: false }), selectedCards => {
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
        return state;
    }
}
exports.Tatsugiriex = Tatsugiriex;
