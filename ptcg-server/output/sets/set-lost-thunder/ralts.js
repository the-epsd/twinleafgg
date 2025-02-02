"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ralts = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* useBeckon(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    const hasSupporter = player.discard.cards.some(c => {
        return c instanceof game_1.TrainerCard && c.trainerType === card_types_1.TrainerType.SUPPORTER;
    });
    if (!hasSupporter) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { min: 1, max: 1, allowCancel: true }), selected => {
        cards = selected || [];
        next();
    });
    cards.forEach((card, index) => {
        store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
    });
    if (cards.length > 0) {
        yield store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    if (cards.length > 0) {
        player.discard.moveCardsTo(cards, player.hand);
    }
    return state;
}
class Ralts extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = Y;
        this.hp = 50;
        this.weakness = [{ type: M }];
        this.resistance = [{ type: D, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Beckon',
                cost: [Y],
                damage: 0,
                text: 'Put a Supporter card from your discard pile into your hand.'
            },
            {
                name: 'Beat',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'LOT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '139';
        this.name = 'Ralts';
        this.fullName = 'Ralts LOT';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useBeckon(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Ralts = Ralts;
