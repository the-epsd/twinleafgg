"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HisuianArcanine = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class HisuianArcanine extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 150;
        this.evolvesFrom = 'Hisuian Growlithe';
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Boulder Crush',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            },
            {
                name: 'Scorching Horn',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 80,
                damageCalculation: '+',
                text: 'If this Pokémon has any [R] Energy attached, this attack does 80 more damage, and your opponent\'s Active Pokémon is now Burned.'
            }
        ];
        this.set = 'ASR';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '71';
        this.name = 'Hisuian Arcanine';
        this.fullName = 'Hisuian Arcanine ASR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const cardList = player.active;
            const hasAttachedEnergy = cardList.cards.some(c => c instanceof game_1.EnergyCard && c.provides.includes(card_types_1.CardType.FIRE || c instanceof game_1.EnergyCard && c.provides.includes(card_types_1.CardType.ANY)));
            if (hasAttachedEnergy) {
                effect.damage = effect.damage + 80;
                const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.BURNED]);
                store.reduceEffect(state, specialConditionEffect);
            }
            return state;
        }
        return state;
    }
}
exports.HisuianArcanine = HisuianArcanine;
