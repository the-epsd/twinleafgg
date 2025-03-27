"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoubleRainbowEnergy = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const check_effects_2 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class DoubleRainbowEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'MA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '88';
        this.name = 'Double Rainbow Energy';
        this.fullName = 'Double Rainbow Energy MA';
        this.text = 'Double Rainbow Energy can be attached only to an Evolved Pokémon (excluding Pokémon-ex). While in play, Double Rainbow Energy provides every type of Energy but provides 2 Energy at a time. (Doesn\’t count as a basic Energy when not in play and has no effect other than providing Energy.) Damage done to your opponent\’s Pokémon by the Pokémon Double Rainbow Energy is attached to is reduced by 10 (after applying Weakness and Resistance). When the Pokémon Double Rainbow Energy is attached to is no longer an Evolved Pokémon, discard Double Rainbow Energy.';
    }
    reduceEffect(store, state, effect) {
        // Cannot attach to basic or ex
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard === this) {
            const attachedTo = effect.target.getPokemonCard();
            if (!!attachedTo && (attachedTo.stage === card_types_1.Stage.BASIC || attachedTo.stage === card_types_1.Stage.RESTORED || attachedTo.tags.includes(card_types_1.CardTag.POKEMON_ex))) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
        }
        // Reduce damage done to opponent's Pokemon by 10
        if ((effect instanceof attack_effects_1.DealDamageEffect) && effect.source.cards.includes(this) && !effect.target.cards.includes(this)) {
            effect.damage -= 10;
        }
        // Provide energy 
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            effect.energyMap.push({ card: this, provides: [card_types_1.CardType.ANY, card_types_1.CardType.ANY] });
        }
        // Discard card when not attached to Evolved Pokemon or pokemon-ex
        if (effect instanceof check_effects_2.CheckTableStateEffect) {
            state.players.forEach(player => {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (!cardList.cards.includes(this)) {
                        return;
                    }
                    const attachedTo = cardList.getPokemonCard();
                    if (!!attachedTo && (attachedTo.stage === card_types_1.Stage.BASIC || attachedTo.stage === card_types_1.Stage.RESTORED || attachedTo.tags.includes(card_types_1.CardTag.POKEMON_ex))) {
                        cardList.moveCardTo(this, player.discard);
                    }
                });
            });
            return state;
        }
        return state;
    }
}
exports.DoubleRainbowEnergy = DoubleRainbowEnergy;
