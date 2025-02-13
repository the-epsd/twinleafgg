"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Onix = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Onix extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.cardType = F;
        this.hp = 110;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Dig Deep',
                cost: [C],
                damage: 0,
                text: 'Put an Energy card from your discard pile into your hand.'
            },
            {
                name: 'Tail Smash',
                cost: [C, C, C],
                damage: 100,
                text: 'Flip a coin. If tails, this attack does nothing.'
            }
        ];
        this.set = 'CEC';
        this.setNumber = '105';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Onix';
        this.fullName = 'Onix CEC';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            //I couldn't find a prefab that moves energies from the discard to the hand.
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
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            //Flip a coin. If tails, this attack does nothing.
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, result => {
                if (result)
                    return;
                effect.damage = 0;
            });
        }
        return state;
    }
}
exports.Onix = Onix;
