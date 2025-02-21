"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hitmonchan = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Hitmonchan extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Hitmonchan';
        this.set = 'TEU';
        this.fullName = 'Hitmonchan TEU';
        this.stage = card_types_1.Stage.BASIC;
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '74';
        this.hp = 90;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Hit and Run',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 30,
                text: 'You may switch this Pokémon with 1 of your Benched Pokémon.'
            },
            {
                name: 'Magnum Punch',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 70,
                text: ''
            }
        ];
        this.usedHitAndRun = false;
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            this.usedHitAndRun = true;
        }
        if (prefabs_1.AFTER_ATTACK(effect) && this.usedHitAndRun) {
            const player = effect.player;
            prefabs_1.SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
            this.usedHitAndRun = false;
        }
        return state;
    }
}
exports.Hitmonchan = Hitmonchan;
