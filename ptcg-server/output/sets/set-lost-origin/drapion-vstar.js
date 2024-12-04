"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrapionVSTAR = void 0;
/* eslint-disable indent */
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const card_types_2 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class DrapionVSTAR extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_2.CardTag.POKEMON_VSTAR];
        this.evolvesFrom = 'Drapion V';
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.VSTAR;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 270;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Hazard Star',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'During your turn, you may make your opponent\'s Active Pokémon Paralyzed and Poisoned. During Pokémon Checkup, put 3 damage counters on that Pokémon instead of 1. (You can\'t use more than 1 VSTAR Power in a game.)'
            }];
        this.attacks = [
            {
                name: 'Big Bang Arm',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
                damage: 250,
                damageCalculation: '-',
                text: 'This attack does 10 less damage for each damage counter on this Pokémon.'
            }
        ];
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '119';
        this.name = 'Drapion VSTAR';
        this.fullName = 'Drapion VSTAR LOR';
    }
    // Implement ability
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.usedVSTAR) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_VSTAR_USED);
            }
            player.usedVSTAR = true;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                }
            });
            opponent.active.addSpecialCondition(card_types_1.SpecialCondition.POISONED);
            opponent.active.addSpecialCondition(card_types_1.SpecialCondition.PARALYZED);
            opponent.active.poisonDamage = 60;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            effect.damage -= effect.player.active.damage;
            return state;
        }
        return state;
    }
}
exports.DrapionVSTAR = DrapionVSTAR;
