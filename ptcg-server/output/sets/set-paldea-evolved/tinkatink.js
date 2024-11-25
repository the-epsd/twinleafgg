"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tinkatink = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* useScrapPickup(next, store, state, self, effect) {
    const player = effect.player;
    const hasItem = player.discard.cards.some(c => {
        return c instanceof game_1.TrainerCard && c.trainerType === card_types_1.TrainerType.ITEM;
    });
    if (!hasItem) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.ITEM }, { min: 1, max: 1, allowCancel: true }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length > 0) {
        player.hand.moveCardTo(self, player.discard);
        player.discard.moveCardsTo(cards, player.hand);
    }
    return state;
}
class Tinkatink extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Scrap Pickup',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Put an Item card from your discard pile into your hand.'
            },
            {
                name: 'Fairy Wind',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }];
        this.regulationMark = 'G';
        this.set = 'PAL';
        this.name = 'Tinkatink';
        this.fullName = 'Tinkatink PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '101';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack == this.attacks[0]) {
            const generator = useScrapPickup(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Tinkatink = Tinkatink;
