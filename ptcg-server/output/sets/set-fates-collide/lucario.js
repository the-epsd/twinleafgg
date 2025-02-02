"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lucario = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Lucario extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Riolu';
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Vacuum Wave',
                cost: [card_types_1.CardType.METAL],
                damage: 50,
                text: 'This attack\'s damage isn\'t affected by Weakness or Resistance.'
            }, {
                name: 'Fight Alone',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'If you have fewer Pokemon in play than your opponent, this ' +
                    'attack does 60 more damage for each Pokemon fewer you have in play.'
            },
        ];
        this.set = 'FCO';
        this.name = 'Lucario';
        this.fullName = 'Lucario FCO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '63';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            effect.ignoreWeakness = true;
            effect.ignoreResistance = true;
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let playerPokemons = 0;
            let opponentPokemons = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, () => { playerPokemons += 1; });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, () => { opponentPokemons += 1; });
            const fewerPokemons = Math.max(0, opponentPokemons - playerPokemons);
            effect.damage += fewerPokemons * 60;
        }
        return state;
    }
}
exports.Lucario = Lucario;
