"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lanturn = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const state_utils_1 = require("../../game/store/state-utils");
function* useAttack(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    let cards = [];
    const itemsInDiscardPile = player.discard.cards.filter(c => c instanceof game_1.TrainerCard && c.trainerType == card_types_1.TrainerType.ITEM).length;
    if (itemsInDiscardPile === 0) {
        return state;
    }
    const blocked = [];
    player.discard.cards.forEach((c, index) => {
        if (c instanceof game_1.TrainerCard && c.trainerType == card_types_1.TrainerType.ITEM) {
        }
        else {
            blocked.push(index);
        }
    });
    const min = Math.min(itemsInDiscardPile, 4);
    const max = Math.min(itemsInDiscardPile, 4);
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DECK, player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.ITEM }, { min, max, allowCancel: false, blocked }), selected => {
        cards = selected || [];
        next();
    });
    player.discard.moveCardsTo(cards, player.deck);
    cards.forEach((card, index) => {
        store.log(state, game_message_1.GameLog.LOG_PLAYER_RETURNS_TO_DECK_FROM_DISCARD, { name: player.name, card: card.name });
    });
    if (cards.length > 0) {
        yield store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Lanturn extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Chinchou';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.METAL, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Salvage',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Shuffle 4 Item cards from your discard pile into your deck.'
            },
            {
                name: 'Signal Beam',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: 'Your opponent\'s Active Pokémon is now Confused.'
            }
        ];
        this.set = 'SCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '46';
        this.name = 'Electabuzz';
        this.fullName = 'Electabuzz SCR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useAttack(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.CONFUSED]);
            store.reduceEffect(state, specialConditionEffect);
            return state;
        }
        return state;
    }
}
exports.Lanturn = Lanturn;
