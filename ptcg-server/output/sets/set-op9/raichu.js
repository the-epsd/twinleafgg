"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Raichu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
class Raichu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pikachu';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING, value: 20 }];
        this.resistance = [{ type: card_types_1.CardType.METAL, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Slam',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'Flip 2 coins. This attack does 30 damage times the number of heads.'
            },
            {
                name: 'High Voltage',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING],
                damage: 60,
                text: 'If Raichu evolved from Pikachu this turn, this attack\'s base ' +
                    'damage is 100 instead of 60.'
            }
        ];
        this.set = 'OP9';
        this.name = 'Raichu';
        this.fullName = 'Raichu OP9';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP),
            ], results => {
                let heads = 0;
                results.forEach(r => { heads += r ? 1 : 0; });
                effect.damage = 30 * heads;
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (!(cardList instanceof game_1.PokemonCardList)) {
                return state;
            }
            if (cardList.pokemonPlayedTurn === state.turn) {
                effect.damage += 40;
            }
        }
        return state;
    }
}
exports.Raichu = Raichu;
