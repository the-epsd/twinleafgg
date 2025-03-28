"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreedentVMAX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class GreedentVMAX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.VMAX;
        this.evolvesFrom = 'Greedent V';
        this.cardType = C;
        this.hp = 320;
        this.tags = [card_types_1.CardTag.POKEMON_VMAX];
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Turn a Profit',
                cost: [C, C],
                damage: 30,
                text: 'If your opponent\'s Basic Pokémon is Knocked Out by damage from this attack, take 2 more Prize cards.'
            },
            {
                name: 'Max Gimme Gimme',
                cost: [C, C, C],
                damage: 160,
                text: 'Draw 3 cards.'
            }];
        this.set = 'FST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '218';
        this.name = 'Greedent VMAX';
        this.fullName = 'Greedent VMAX FST';
        this.usedTurnAProfit = false;
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const opponent = effect.opponent;
            if (((_a = opponent.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) === card_types_1.Stage.BASIC) {
                this.usedTurnAProfit = true;
            }
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            this.usedTurnAProfit = false;
            prefabs_1.DRAW_CARDS(player, 3);
        }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target === effect.player.active) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Do not activate between turns, or when it's not opponents turn.
            if (state.phase !== game_1.GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
                return state;
            }
            // Guzzy wasn't attacking
            const pokemonCard = opponent.active.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            // Check if the attack that caused the KnockOutEffect is "Turn a Profit"
            if (this.usedTurnAProfit === true) {
                if (effect.prizeCount > 0) {
                    effect.prizeCount += 2;
                }
                this.usedTurnAProfit = false;
            }
            return state;
        }
        return state;
    }
}
exports.GreedentVMAX = GreedentVMAX;
