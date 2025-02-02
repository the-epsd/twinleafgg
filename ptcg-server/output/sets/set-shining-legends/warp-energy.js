"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarpEnergy = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class WarpEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'SLG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '70';
        this.name = 'Warp Energy';
        this.fullName = 'Warp Energy SHL';
        this.text = 'This card provides [C] Energy.' +
            '' +
            'When you attach this card from your hand to your Active Pokémon, switch that Pokémon with 1 of your Benched Pokémon.4244';
    }
    reduceEffect(store, state, effect) {
        var _a, _b;
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && ((_b = (_a = effect.target) === null || _a === void 0 ? void 0 : _a.cards) === null || _b === void 0 ? void 0 : _b.includes(this))) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            if (effect.player.active !== effect.target) {
                return state;
            }
            state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                const cardList = result[0];
                player.switchPokemon(cardList);
            });
        }
        return state;
    }
}
exports.WarpEnergy = WarpEnergy;
