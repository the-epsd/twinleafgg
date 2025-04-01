"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meowth = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Meowth extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.cardType = C;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Pickup Power',
                cost: [C],
                damage: 0,
                text: 'Put an Energy card from your discard pile into your hand.'
            },
            {
                name: 'Bite',
                cost: [C],
                damage: 10,
                text: ''
            }
        ];
        this.set = 'DS';
        this.setNumber = '77';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Meowth';
        this.fullName = 'Meowth DS';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c instanceof game_1.EnergyCard;
            });
            if (!hasEnergyInDiscard) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: game_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), cards => {
                cards = cards || [];
                player.discard.moveCardsTo(cards, player.hand);
            });
        }
        return state;
    }
}
exports.Meowth = Meowth;
