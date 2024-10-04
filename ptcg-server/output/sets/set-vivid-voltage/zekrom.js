"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zekrom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Zekrom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Slash',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            },
            {
                name: 'Wild Shock',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 130,
                text: 'This Pokémon also does 60 damage to itself. Your opponent\'s Active Pokémon is now Paralyzed.'
            }];
        this.set = 'VIV';
        this.regulationMark = 'D';
        this.setNumber = '60';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Zekrom';
        this.fullName = 'Zekrom VIV';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            //Damage yourself
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 60);
            dealDamage.target = player.active;
            //Paralyze Opp
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED]);
            store.reduceEffect(state, specialConditionEffect);
            return store.reduceEffect(state, dealDamage);
        }
        return state;
    }
}
exports.Zekrom = Zekrom;
