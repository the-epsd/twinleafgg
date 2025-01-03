"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fuecoco = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Fuecoco extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.FIRE;
        this.hp = 90;
        this.weakness = [{ type: game_1.CardType.WATER }];
        this.resistance = [];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Spacing Out',
                cost: [game_1.CardType.COLORLESS],
                damage: 0,
                text: 'Flip a coin. If heads, heal 30 damage from this Pokémon.'
            }, {
                name: 'Flare',
                cost: [game_1.CardType.FIRE, game_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }];
        this.regulationMark = 'G';
        this.set = 'PAL';
        this.setNumber = '35';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Fuecoco';
        this.fullName = 'Fuecoco PAL';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP), flipResult => {
                if (flipResult) {
                    const healEffect = new game_effects_1.HealEffect(effect.player, effect.source, 30);
                    store.reduceEffect(state, healEffect);
                }
            });
        }
        return state;
    }
}
exports.Fuecoco = Fuecoco;
