"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripleAccelerationEnergy = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class TripleAccelerationEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'UNB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '190';
        this.name = 'Triple Acceleration Energy';
        this.fullName = 'Triple Acceleration Energy UNB';
        this.text = 'This card can only be attached to Evolution Pokémon. If this card is attached to 1 of your Pokémon, discard it at the end of the turn.' +
            '' +
            'This card provides [C][C][C] Energy only while it is attached to an Evolution Pokémon.' +
            '' +
            'If this card is attached to anything other than an Evolution Pokémon, discard this card.';
        this.TRIPLE_ACCELERATION_MARKER = 'TRIPLE_ACCELERATION_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard === this) {
            const attachedTo = effect.target.getPokemonCard();
            if (!!attachedTo && (attachedTo.stage === card_types_1.Stage.BASIC || attachedTo.stage === card_types_1.Stage.RESTORED)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            effect.player.marker.addMarker(this.TRIPLE_ACCELERATION_MARKER, this);
        }
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            const attachedTo = effect.source.getPokemonCard();
            if (!!attachedTo && attachedTo instanceof pokemon_card_1.PokemonCard && attachedTo.stage !== card_types_1.Stage.BASIC && attachedTo.stage !== card_types_1.Stage.RESTORED) {
                effect.energyMap.push({ card: this, provides: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS] });
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect && effect.player.marker.hasMarker(this.TRIPLE_ACCELERATION_MARKER, this)) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList.cards.includes(this)) {
                    cardList.moveCardTo(this, player.discard);
                    effect.player.marker.removeMarker(this.TRIPLE_ACCELERATION_MARKER, this);
                }
            });
        }
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            state.players.forEach(player => {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (!cardList.cards.includes(this)) {
                        return;
                    }
                    const attachedTo = cardList.getPokemonCard();
                    if (!!attachedTo && (attachedTo.stage === card_types_1.Stage.BASIC || attachedTo.stage === card_types_1.Stage.RESTORED)) {
                        cardList.moveCardTo(this, player.discard);
                    }
                });
            });
            return state;
        }
        return state;
    }
}
exports.TripleAccelerationEnergy = TripleAccelerationEnergy;
