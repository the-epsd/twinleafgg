"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slowpoke = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Slowpoke extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Hold Still',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Heal 30 damage from this Pokémon.'
            },
            {
                name: 'Ideal Fishing Day',
                cost: [card_types_1.CardType.WATER],
                damage: 0,
                text: 'Put an Item card from your discard pile into your hand.'
            }];
        this.set = 'PGO';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '19';
        this.name = 'Slowpoke';
        this.fullName = 'Slowpoke PGO';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 30);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const blocked = [];
            let numItems = 0;
            player.discard.cards.forEach((c, index) => {
                const isItem = c instanceof game_1.TrainerCard && c.trainerType === card_types_1.TrainerType.ITEM;
                if (!isItem) {
                    blocked.push(index);
                }
                else {
                    numItems++;
                }
            });
            if (numItems === 0) {
                return state;
            }
            let cards = [];
            store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.ITEM }, { min: 1, max: 1, allowCancel: false, blocked }), selected => {
                cards = selected || [];
                cards.forEach((card, index) => {
                    store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                });
                player.discard.moveCardsTo(cards, player.hand);
                return state;
            });
        }
        return state;
    }
}
exports.Slowpoke = Slowpoke;
