"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weepinbell = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Weepinbell extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.regulationMark = 'E';
        this.evolvesFrom = 'Bellsprout';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Dangerous Mucus',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve ' +
                    '1 of your Pokémon, you may make your ' +
                    'opponent\'s Active Pokémon Burned and Poisoned.'
            }];
        this.attacks = [
            {
                name: 'Vine Whip',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 40,
                text: ''
            }
        ];
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '2';
        this.name = 'Weepinbell';
        this.fullName = 'Weepinbell BST';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            // Apply burn and poison to opponent's active Pokemon
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.specialConditions.push(card_types_1.SpecialCondition.BURNED);
            opponent.active.specialConditions.push(card_types_1.SpecialCondition.POISONED);
            return state;
        }
        return state;
    }
}
exports.Weepinbell = Weepinbell;
