"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LucarioVSTAR = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
const game_1 = require("../../game");
class LucarioVSTAR extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.VSTAR;
        this.tags = [card_types_1.CardTag.POKEMON_VSTAR];
        this.evolvesFrom = 'Lucario V';
        this.cardType = card_types_1.CardType.FIGHTING;
        this.regulationMark = 'F';
        this.hp = 270;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Fighting Knuckle',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 120,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon is a Pokémon V, this attack does 120 more damage.'
            },
            {
                name: 'Aura Star',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 70,
                damageCalculation: 'x',
                text: 'This attack does 70 damage for each Energy attached to all of your opponent\'s Pokémon. (You can\'t use more than 1 VSTAR Power in a game.)'
            }
        ];
        this.set = 'SWSH';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '214';
        this.name = 'Lucario VSTAR';
        this.fullName = 'Lucario VSTAR SWSH';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const defending = opponent.active.getPokemonCard();
            if (defending && defending.tags.includes(card_types_1.CardTag.POKEMON_V) || defending && defending.tags.includes(card_types_1.CardTag.POKEMON_VSTAR) || defending && defending.tags.includes(card_types_1.CardTag.POKEMON_VMAX)) {
                effect.damage += 120;
                return state;
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            if (player.usedVSTAR === true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_VSTAR_USED);
            }
            let totalEnergy = 0;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                totalEnergy += cardList.cards.filter(c => c instanceof game_1.EnergyCard).length;
            });
            effect.damage += totalEnergy * 70;
            player.usedVSTAR = true;
        }
        return state;
    }
}
exports.LucarioVSTAR = LucarioVSTAR;
