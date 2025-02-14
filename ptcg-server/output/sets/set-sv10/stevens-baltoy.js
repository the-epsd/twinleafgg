"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StevensBaltoy = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class StevensBaltoy extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.STEVENS];
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Summoning Sign',
                cost: [C],
                damage: 0,
                text: 'Search your deck for up to 2 Basic Steven\'s Pokémon and put them onto your Bench. Then, shuffle your deck.'
            }, {
                name: 'Psychic Sphere',
                cost: [P],
                damage: 20,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'SVOD';
        this.setNumber = '1';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Steven\'s Baltoy';
        this.fullName = 'Steven\'s Baltoy SVOD';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const slots = prefabs_1.GET_PLAYER_BENCH_SLOTS(player);
            if (slots.length === 0) {
                return state;
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, {
                min: 0, max: Math.min(slots.length, 2), allowCancel: false,
                blocked: player.deck.cards
                    .filter(c => !c.tags.includes(card_types_1.CardTag.STEVENS))
                    .map(c => player.deck.cards.indexOf(c))
            }), selected => {
                const cards = selected || [];
                cards.forEach((card, index) => {
                    player.deck.moveCardTo(card, slots[index]);
                    slots[index].pokemonPlayedTurn = state.turn;
                });
                prefabs_1.SHUFFLE_DECK(store, state, player);
                return state;
            });
        }
        return state;
    }
}
exports.StevensBaltoy = StevensBaltoy;
