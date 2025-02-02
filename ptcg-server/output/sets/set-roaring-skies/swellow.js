"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swellow = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Swellow extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Taillow';
        this.powers = [{
                name: 'Delta Plus',
                powerType: pokemon_types_1.PowerType.ANCIENT_TRAIT,
                text: 'If your opponent\'s Pokemon is Knocked Out by damage from an ' +
                    'attack of this Pokemon, take 1 more Prize card.'
            }];
        this.attacks = [{
                name: 'Peck',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            },
            {
                name: 'Wing Attack',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            }];
        this.set = 'ROS';
        this.setNumber = '72';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Swellow';
        this.fullName = 'Swellow ROS';
    }
    reduceEffect(store, state, effect) {
        // Delta Plus
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target === effect.player.active) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Do not activate between turns, or when it's not opponents turn.
            if (state.phase !== game_1.GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
                return state;
            }
            // Swellow wasn't attacking
            const pokemonCard = opponent.active.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            if (effect.prizeCount > 0) {
                effect.prizeCount += 1;
                return state;
            }
        }
        return state;
    }
}
exports.Swellow = Swellow;
