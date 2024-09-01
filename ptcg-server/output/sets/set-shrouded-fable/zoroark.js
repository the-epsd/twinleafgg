"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zoroark = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
class Zoroark extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Zorua';
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Illusory Hijacking',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 60,
                damageCalculation: 'x',
                text: 'This attack does 60 damage for each of your opponent\'s Pokémon ex and Pokémon V in play.'
            },
            {
                name: 'Claw Slash',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 110,
                text: 'Discard 2 Energy from this Pokémon.'
            }
        ];
        this.set = 'SFA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '32';
        this.name = 'Zoroark';
        this.fullName = 'Zoroark SFA';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let opponentExOrV = 0;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (card.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                    opponentExOrV++;
                }
                if (card.tags.includes(card_types_1.CardTag.POKEMON_V)) {
                    opponentExOrV++;
                }
                if (card.tags.includes(card_types_1.CardTag.POKEMON_VMAX)) {
                    opponentExOrV++;
                }
                if (card.tags.includes(card_types_1.CardTag.POKEMON_VSTAR)) {
                    opponentExOrV++;
                }
            });
            effect.damage = 60 * opponentExOrV;
        }
        return state;
    }
}
exports.Zoroark = Zoroark;
