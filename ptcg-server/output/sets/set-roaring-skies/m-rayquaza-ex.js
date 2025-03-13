"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MRayquazaEX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class MRayquazaEX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.MEGA;
        this.tags = [card_types_1.CardTag.POKEMON_EX, card_types_1.CardTag.MEGA];
        this.evolvesFrom = 'Rayquaza EX';
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 230;
        this.weakness = [{ type: card_types_1.CardType.FAIRY }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Delta Wild',
                powerType: pokemon_types_1.PowerType.ANCIENT_TRAIT,
                text: 'Any damage done to this Pokémon by attacks from your opponent\'s Grass, Fire, Water, or Lightning Pokémon is reduced by 20(after applying Weakness and Resistance).'
            }];
        this.attacks = [
            {
                name: 'Dragon Ascent',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 300,
                text: 'Discard 2 Energy attached to this Pokémon.'
            }
        ];
        this.set = 'ROS';
        this.name = 'M Rayquaza EX';
        this.fullName = 'M Rayquaza EX ROS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '61';
    }
    reduceEffect(store, state, effect) {
        if ((effect instanceof game_effects_1.EvolveEffect) && effect.pokemonCard === this) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this && cardList.tool && cardList.tool.name === 'Rayquaza Spirit Link') {
                    return state;
                }
                else {
                    const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
                    store.reduceEffect(state, endTurnEffect);
                    return state;
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Discard 2 cards from opponent's deck 
            opponent.deck.moveTo(opponent.discard, 5);
        }
        return state;
    }
}
exports.MRayquazaEX = MRayquazaEX;
