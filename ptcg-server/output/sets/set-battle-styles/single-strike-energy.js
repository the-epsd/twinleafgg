"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleStrikeEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const state_utils_1 = require("../../game/store/state-utils");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class SingleStrikeEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.SINGLE_STRIKE];
        this.regulationMark = 'E';
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '141';
        this.name = 'Single Strike Energy';
        this.fullName = 'Single Strike Energy BST';
        this.text = 'This card can only be attached to a Single Strike Pokémon.' +
            'If this card is attached to anything other than a Single ' +
            'Strike Pokémon, discard this card. ' +
            '' +
            'As long as this card is attached to a Pokémon, it provides ' +
            'F and D Energy but provides only 1 Energy at a time, and the ' +
            'attacks of the Pokémon this card is attached to do 20 more ' +
            'damage to your opponent\'s Active Pokémon (before applying ' +
            'Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        var _a;
        // Provide energy when attached to Single Strike Pokemon
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            const pokemon = effect.source;
            if ((_a = pokemon.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.SINGLE_STRIKE)) {
                effect.energyMap.push({ card: this, provides: [card_types_1.CardType.FIGHTING || card_types_1.CardType.DARK] });
            }
            return state;
        }
        // Discard card when not attached to Single Strike Pokemon
        if (effect instanceof play_card_effects_1.AttachEnergyEffect) {
            state.players.forEach(player => {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    var _a;
                    if (!cardList.cards.includes(this)) {
                        return;
                    }
                    const pokemon = cardList;
                    if (!((_a = pokemon.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.SINGLE_STRIKE))) {
                        cardList.moveCardTo(this, player.discard);
                    }
                });
            });
            return state;
        }
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.source.cards.includes(this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            if (effect.target !== opponent.active) {
                return state;
            }
            effect.damage += 20;
        }
        return state;
    }
}
exports.SingleStrikeEnergy = SingleStrikeEnergy;
