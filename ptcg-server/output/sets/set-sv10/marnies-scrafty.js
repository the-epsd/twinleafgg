"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarniesScrafty = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class MarniesScrafty extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Marnie\'s Scraggy';
        this.tags = [card_types_1.CardTag.MARNIES];
        this.cardType = D;
        this.hp = 120;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Rear Kick',
                cost: [D],
                damage: 40,
                text: ''
            }, {
                name: 'Wild Tackle',
                cost: [D, D, C],
                damage: 160,
                text: 'This Pokémon also does 30 damage to itself.'
            }];
        this.regulationMark = 'I';
        this.set = 'SVOM';
        this.setNumber = '4';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Marnie\'s Scrafty';
        this.fullName = 'Marnie\'s Scrafty SVOM';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 30);
            dealDamage.target = player.active;
            return store.reduceEffect(state, dealDamage);
        }
        return state;
    }
}
exports.MarniesScrafty = MarniesScrafty;
