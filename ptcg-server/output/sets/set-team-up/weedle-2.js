"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeedleTEU2 = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class WeedleTEU2 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.GRASS;
        this.hp = 50;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.set = 'TEU';
        this.setNumber = '2';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Weedle';
        this.fullName = 'Weedle TEU 2';
        this.attacks = [
            {
                name: 'Tangle Drag',
                cost: [game_1.CardType.GRASS],
                damage: 0,
                text: 'Switch 1 of your opponent\'s Benched Pokemon with their Active Pokemon.'
            },
            { name: 'Bug Bite', cost: [game_1.CardType.GRASS], damage: 10, text: '' }
        ];
    }
    reduceEffect(store, state, effect) {
        // Tangle Drag
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                const cardList = result[0];
                opponent.switchPokemon(cardList);
            });
        }
        return state;
    }
}
exports.WeedleTEU2 = WeedleTEU2;
