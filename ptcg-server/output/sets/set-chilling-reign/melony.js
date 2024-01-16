"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Melony = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        return state;
    }
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Basic Water Energy' }, { min: 1, max: 1, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length > 0) {
        yield store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { allowCancel: true }), targets => {
            if (!targets || targets.length === 0) {
                return;
            }
            const target = targets[0];
            if (!target.cards[0].tags.includes(card_types_1.CardTag.POKEMON_V) &&
                !target.cards[0].tags.includes(card_types_1.CardTag.POKEMON_VSTAR) &&
                !target.cards[0].tags.includes(card_types_1.CardTag.POKEMON_VMAX)) {
                player.deck.moveCardsTo(cards, target);
                next();
            }
            return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
            });
        });
    }
}
class Melony extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '146';
        this.regulationMark = 'E';
        this.name = 'Melony';
        this.fullName = 'Melony CRE 146';
        this.text = 'Draw 3 cards. If you drew any cards in this way, your opponent discards Pokémon from their Bench until they have 3.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Melony = Melony;
