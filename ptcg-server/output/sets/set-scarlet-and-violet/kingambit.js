"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kingambit = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Kingambit extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Bisharp';
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 170;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Leadership',
                powerType: game_1.PowerType.ABILITY,
                text: 'Your Basic Pokémon\'s attacks do 30 more damage to your opponent’s Active Pokémon (before applying Weakness and Resistance).'
            }];
        this.attacks = [
            {
                name: 'Hack At',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 160,
                text: ''
            }
        ];
        this.set = 'SVI';
        this.setNumber = '134';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'H';
        this.name = 'Kingambit';
        this.fullName = 'Kingambit SVI';
    }
    reduceEffect(store, state, effect) {
        // Leadership
        if (effect instanceof attack_effects_1.DealDamageEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // checking if this pokemon is in play
            let isThisInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isThisInPlay = true;
                }
            });
            if (!isThisInPlay) {
                return state;
            }
            // making this only affect our pokemon's damage if it's a basic 
            // (wow this is actually garbage in standard why does it only affect basics and not every stage of pokemon)
            const oppActive = opponent.active.getPokemonCard();
            const damageSource = effect.source.getPokemonCard();
            if (damageSource && damageSource.stage === card_types_1.Stage.BASIC && damageSource !== oppActive) {
                effect.damage += 30;
                return state;
            }
        }
        return state;
    }
}
exports.Kingambit = Kingambit;
