"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Abra = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Abra extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 40;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Teleporter',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, if this Pokémon is in the Active Spot, you may shuffle it and all attached cards into your deck.'
            }];
        this.attacks = [{
                name: 'Beam',
                cost: [P],
                damage: 10,
                text: '',
            }];
        this.regulationMark = 'H';
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '80';
        this.name = 'Abra';
        this.fullName = 'Abra TWM';
    }
    reduceEffect(store, state, effect) {
        // Teleport
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.active.getPokemonCard() !== this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            player.active.moveTo(player.deck);
            player.active.clearEffects();
            return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
            });
        }
        return state;
    }
}
exports.Abra = Abra;
