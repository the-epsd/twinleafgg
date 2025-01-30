"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarniesImpidimp = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class MarniesImpidimp extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.MARNIES];
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [
            { name: 'Filch', cost: [C], damage: 0, text: 'Draw a card.' },
            { name: 'Corkscrew Punch', cost: [D], damage: 10, text: '' },
        ];
        this.regulationMark = 'I';
        this.set = 'SVOM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '5';
        this.name = 'Marnie\'s Impidimp';
        this.fullName = 'Marnie\'s Impidimp SVOM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack == this.attacks[0]) {
            const player = effect.player;
            player.deck.moveTo(player.hand, 1);
            return state;
        }
        return state;
    }
}
exports.MarniesImpidimp = MarniesImpidimp;
