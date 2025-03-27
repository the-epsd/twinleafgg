"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreatTusk2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class GreatTusk2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.ANCIENT];
        this.cardType = F;
        this.hp = 140;
        this.weakness = [{ type: P }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Lunge Out',
                cost: [F, C],
                damage: 30,
                text: ''
            },
            {
                name: 'Wrathful Charge',
                cost: [F, C, C],
                damage: 80,
                damageCalculation: '+',
                text: 'If your Benched Pokémon have any damage counters on them, this attack does 80 more damage.'
            },
        ];
        this.set = 'TEF';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '96';
        this.name = 'Great Tusk';
        this.fullName = 'Great Tusk 2 TEF';
    }
    reduceEffect(store, state, effect) {
        // Wrathful Charge
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            let isThereDamage = false;
            player.bench.forEach(cardList => {
                if (cardList.cards.length > 0 && cardList.damage > 0) {
                    isThereDamage = true;
                }
            });
            if (isThereDamage) {
                effect.damage += 80;
            }
        }
        return state;
    }
}
exports.GreatTusk2 = GreatTusk2;
