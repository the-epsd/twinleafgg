"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Primeape = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Primeape extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Mankey';
        this.attacks = [
            {
                name: 'Raging Punch',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 70,
                text: 'This Pokemon also does 10 damage to itself.'
            }
        ];
        this.regulationMark = 'G';
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '108';
        this.name = 'Primeape';
        this.fullName = 'Primeape SVI';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 20);
            dealDamage.target = player.active;
            return store.reduceEffect(state, dealDamage);
        }
        return state;
    }
}
exports.Primeape = Primeape;
