"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Froslass = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Froslass extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.evolvesFrom = 'Snorunt';
        this.regulationMark = 'H';
        this.cardType = card_types_1.CardType.WATER;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.hp = 90;
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Chilling Curtain',
                powerType: game_1.PowerType.ABILITY,
                text: 'During Pokémon Checkup, put 1 damage counter on each Pokémon in play that has any Abilities (excluding any Froslass).'
            }];
        this.attacks = [
            {
                name: 'Frost Smash',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: ''
            }
        ];
        this.set = 'SV6';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '33';
        this.name = 'Froslass';
        this.fullName = 'Froslass SV6';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (state.phase === state_1.GamePhase.BETWEEN_TURNS) {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                    if (effect.card.name !== 'Froslass') {
                        cardList.damage += 10;
                    }
                });
                opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                    if (effect.card.name !== 'Froslass') {
                        cardList.damage += 10;
                    }
                });
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.Froslass = Froslass;
