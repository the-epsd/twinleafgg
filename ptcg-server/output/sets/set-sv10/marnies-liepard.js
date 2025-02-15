"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarniesLiepard = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MarniesLiepard extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Marnie\'s Purrloin';
        this.tags = [card_types_1.CardTag.MARNIES];
        this.cardType = D;
        this.hp = 100;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Sharp Claw',
                cost: [D, D],
                damage: 70,
                text: 'If your opponent\'s Active Pokémon is a Pokémon ex, this attack does 70 more damage.'
            }];
        this.regulationMark = 'I';
        this.set = 'SVOM';
        this.setNumber = '2';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Marnie\'s Liepard';
        this.fullName = 'Marnie\'s Liepard SVOM';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const defending = opponent.active.getPokemonCard();
            if (defending && defending.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                prefabs_1.THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, 70);
            }
        }
        return state;
    }
}
exports.MarniesLiepard = MarniesLiepard;
