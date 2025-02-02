"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeedrillVIV = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class BeedrillVIV extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Kakuna';
        this.cardType = game_1.CardType.GRASS;
        this.hp = 130;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.retreat = [];
        this.set = 'VIV';
        this.setNumber = '3';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Beedrill';
        this.fullName = 'Beedrill VIV';
        this.regulationMark = 'D';
        this.powers = [
            {
                name: 'Elusive Master',
                powerType: game_1.PowerType.ABILITY,
                useFromHand: true,
                text: 'Once during your turn, if this Pokemon is the last card in your hand, you may play it onto your Bench. If you do, draw 3 cards.'
            }
        ];
        this.attacks = [{ name: 'Sharp Sting', cost: [game_1.CardType.GRASS, game_1.CardType.COLORLESS], damage: 120, text: '' }];
    }
    reduceEffect(store, state, effect) {
        // Elusive Master
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            if (player.hand.cards.filter(c => c !== this).length !== 0)
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            prefabs_1.PLAY_POKEMON_FROM_HAND_TO_BENCH(state, player, this);
            player.deck.moveTo(player.hand, 3);
        }
        return state;
    }
}
exports.BeedrillVIV = BeedrillVIV;
