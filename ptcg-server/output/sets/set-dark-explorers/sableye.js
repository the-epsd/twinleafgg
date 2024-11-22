"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sableye = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_message_1 = require("../../game/game-message");
class Sableye extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 70;
        this.weakness = [];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Confuse Ray',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: 'Flip a coin. If heads, the Defending Pokemon is now Confused.'
            },
            {
                name: 'Junk Hunt',
                cost: [card_types_1.CardType.DARK],
                damage: 0,
                text: 'Put 2 Item cards from your discard pile into your hand.'
            }
        ];
        this.set = 'DEX';
        this.name = 'Sableye';
        this.fullName = 'Sableye DEX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '62';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    const addSpecialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.CONFUSED]);
                    store.reduceEffect(state, addSpecialCondition);
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const itemCount = player.discard.cards.filter(c => {
                return c instanceof game_1.TrainerCard && c.trainerType === card_types_1.TrainerType.ITEM;
            }).length;
            if (itemCount === 0) {
                return state;
            }
            const max = Math.min(2, itemCount);
            const min = max;
            return store.prompt(state, [
                new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.ITEM }, { min, max, allowCancel: false })
            ], selected => {
                const cards = selected || [];
                player.discard.moveCardsTo(cards, player.hand);
            });
        }
        return state;
    }
}
exports.Sableye = Sableye;
