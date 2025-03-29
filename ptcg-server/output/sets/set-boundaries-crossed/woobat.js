"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Woobat = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Woobat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Scout',
                cost: [P],
                damage: 0,
                text: 'Your opponent reveals their hand.'
            },
            {
                name: 'Heart Stamp',
                cost: [C, C],
                damage: 20,
                text: ''
            },
        ];
        this.set = 'BCR';
        this.setNumber = '70';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Woobat';
        this.fullName = 'Woobat BCR';
    }
    reduceEffect(store, state, effect) {
        // See Through
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            return store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_EFFECT, opponent.hand.cards), () => { });
        }
        return state;
    }
}
exports.Woobat = Woobat;
