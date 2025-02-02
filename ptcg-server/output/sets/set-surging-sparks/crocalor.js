"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crocalor = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Crocalor extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Fuecoco';
        this.cardType = game_1.CardType.FIRE;
        this.hp = 110;
        this.weakness = [{ type: game_1.CardType.WATER }];
        this.resistance = [];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Heat Breath',
                cost: [game_1.CardType.FIRE, game_1.CardType.COLORLESS],
                damage: 30,
                text: 'Flip a coin. If heads, this attack does 50 more damage.'
            }];
        this.regulationMark = 'H';
        this.set = 'SSP';
        this.setNumber = '30';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Crocalor';
        this.fullName = 'Crocalor SV8';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    effect.damage += 50;
                }
            });
        }
        return state;
    }
}
exports.Crocalor = Crocalor;
