"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaptureEnergy = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class CaptureEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'RCL';
        this.regulationMark = 'D';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '171';
        this.name = 'Capture Energy';
        this.fullName = 'Capture Energy RCL';
        this.text = 'This card provides [C] Energy.' +
            '' +
            'When you attach this card from your hand to a Pokémon, search your deck for a Basic Pokémon and put it onto your Bench. Then, shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard === this) {
            const player = effect.player;
            const slots = player.bench.filter(b => b.cards.length === 0).length;
            if (slots === 0) {
                return state;
            }
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max: 1, allowCancel: false }), selectedCards => {
                cards = selectedCards || [];
                // Operation canceled by the user
                if (cards.length === 0) {
                    return state;
                }
                const openSlots = player.bench.filter(b => b.cards.length === 0);
                cards.forEach((card, index) => {
                    player.deck.moveCardTo(card, openSlots[index]);
                    openSlots[index].pokemonPlayedTurn = state.turn;
                });
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.CaptureEnergy = CaptureEnergy;
