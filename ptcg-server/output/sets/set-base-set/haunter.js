"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Haunter = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
class Haunter extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Haunter';
        this.set = 'BS';
        this.fullName = 'Haunter BS';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Gastly';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '29';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 60;
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Hypnosis',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 0,
                text: 'The Defending Pokémon is now Asleep.'
            },
            {
                name: 'Dream Eater',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC],
                damage: 50,
                text: 'You can\'t use this attack unless the Defending Pokémon is Asleep.'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const condition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.ASLEEP]);
            return store.reduceEffect(state, condition);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            if (!opponent.active.specialConditions.includes(card_types_1.SpecialCondition.ASLEEP)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
        }
        return state;
    }
}
exports.Haunter = Haunter;
