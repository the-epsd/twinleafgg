"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MrMime = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class MrMime extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Look-Alike Show',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Your opponent reveals their hand. You may use the effect of a Supporter card you find there as the effect of this attack.'
            },
            {
                name: 'Eerie Wave',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 20,
                text: 'Your opponent\'s Active Pokémon is now Confused.'
            }
        ];
        this.set = 'TEF';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '63';
        this.name = 'Mr. Mime';
        this.fullName = 'Mr. Mime TEF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList.specialConditions.length > 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (cardList !== player.active) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_COPY_EFFECT, opponent.hand, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { allowCancel: false, min: 0, max: 1 }), cards => {
                if (cards === null || cards.length === 0) {
                    return;
                }
                const trainerCard = cards[0];
                const playTrainerEffect = new play_card_effects_1.TrainerEffect(player, trainerCard);
                store.reduceEffect(state, playTrainerEffect);
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.CONFUSED]);
            store.reduceEffect(state, specialConditionEffect);
        }
        return state;
    }
}
exports.MrMime = MrMime;
