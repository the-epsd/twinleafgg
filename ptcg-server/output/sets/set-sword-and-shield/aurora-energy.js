"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuroraEnergy = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class AuroraEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'SSH';
        this.regulationMark = 'D';
        this.name = 'Aurora Energy';
        this.fullName = 'Aurora Energy SSH';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '186';
        this.text = 'You can attach this card to 1 of your Pokémon only if you discard another card from your hand. As long as this card is attached to a Pokémon, it provides every type of Energy but provides only 1 Energy at a time.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            effect.energyMap.push({ card: this, provides: [card_types_1.CardType.ANY] });
        }
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.AuroraEnergy = AuroraEnergy;
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    let cards = [];
    cards = player.hand.cards.filter(c => c !== self);
    if (cards.length < 1) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const handTemp = new game_1.CardList();
    handTemp.cards = player.hand.cards.filter(c => c !== self);
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, handTemp, {}, { min: 1, max: 1, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    // Operation canceled by the user
    if (cards.length === 0) {
        return state;
    }
    player.hand.moveCardsTo(cards, player.discard);
    player.supporter.moveCardTo(self, player.discard);
    return state;
}
