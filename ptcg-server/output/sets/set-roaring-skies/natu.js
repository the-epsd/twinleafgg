"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Natu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Natu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 40;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Delta Plus',
                powerType: pokemon_types_1.PowerType.ANCIENT_TRAIT,
                text: 'If your opponent\'s Pokemon is Knocked Out by damage from an ' +
                    'attack of this Pokemon, take 1 more Prize card.'
            }];
        this.attacks = [{
                name: 'Psywave',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 10,
                text: ' This attack does 10 damage times the amount of Energy attached to your opponent\'s Active Pokémon.'
            }];
        this.set = 'ROS';
        this.setNumber = '28';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Natu';
        this.fullName = 'Natu ROS';
    }
    reduceEffect(store, state, effect) {
        // Delta Plus
        if (effect instanceof game_effects_1.KnockOutEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Do not activate between turns, or when it's not opponents turn.
            if (state.phase !== game_1.GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
                return state;
            }
            // Natu wasn't attacking
            const pokemonCard = opponent.active.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            if (effect.prizeCount > 0) {
                effect.prizeCount += 1;
                return state;
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActivePokemon = opponent.active;
            let energyCount = 0;
            opponentActivePokemon.cards.forEach(c => {
                if (c instanceof game_1.EnergyCard) {
                    energyCount++;
                }
            });
            effect.damage = energyCount * 10;
        }
        return state;
    }
}
exports.Natu = Natu;
