"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dunsparce = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dunsparce extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Strike and Run',
                cost: [C],
                damage: 0,
                text: 'Search your deck for up to 3 Basic Pokémon and put them onto your Bench. Then, shuffle your deck. If you put any Pokémon onto your Bench in this way, you may switch this Pokémon with 1 of your Benched Pokémon.'
            },
            {
                name: 'Sudden Flash',
                cost: [C],
                damage: 10,
                text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
            }
        ];
        this.set = 'CES';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '110';
        this.name = 'Dunsparce';
        this.fullName = 'Dunsparce CES';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const openSlots = player.bench.filter(b => b.cards.length === 0);
            if (player.deck.cards.length === 0 || openSlots.length === 0) {
                return state;
            }
            const maxPokemons = Math.min(openSlots.length, 3);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max: Math.min(3, maxPokemons), allowCancel: false }), selectedCards => {
                const cards = selectedCards || [];
                cards.forEach((card, index) => {
                    player.deck.moveCardTo(card, openSlots[index]);
                    openSlots[index].pokemonPlayedTurn = state.turn;
                    store.log(state, game_1.GameLog.LOG_PLAYER_PLAYS_BASIC_POKEMON, { name: player.name, card: card.name });
                });
                prefabs_1.SHUFFLE_DECK(store, state, player);
                if (cards.length > 0) {
                    prefabs_1.CONFIRMATION_PROMPT(store, state, player, result => {
                        if (result) {
                            prefabs_1.SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
                        }
                    });
                }
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, result => {
                if (result) {
                    prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
                }
            });
        }
        return state;
    }
}
exports.Dunsparce = Dunsparce;
