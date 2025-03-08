"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MistysLapras = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MistysLapras extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.MISTYS];
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'I';
        this.cardType = W;
        this.hp = 110;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Swim Together',
                cost: [W],
                damage: 0,
                text: 'Search your deck for up to 3 Misty\'s Pokémon, reveal them, and put them into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Surf',
                cost: [W, C],
                damage: 60,
                text: ''
            },
        ];
        this.set = 'SV9a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '27';
        this.name = 'Misty\'s Lapras';
        this.fullName = 'Misty\'s Lapras SV9a';
    }
    reduceEffect(store, state, effect) {
        // Swim Together
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                if (card instanceof pokemon_card_1.PokemonCard && !card.tags.includes(card_types_1.CardTag.MISTYS)) {
                    blocked.push(index);
                }
            });
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 3, allowCancel: false, blocked }), cards => {
                if (cards.length > 0) {
                    prefabs_1.MOVE_CARDS_TO_HAND(store, state, player, cards);
                    prefabs_1.SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
                }
                prefabs_1.SHUFFLE_DECK(store, state, player);
            });
        }
        return state;
    }
}
exports.MistysLapras = MistysLapras;
