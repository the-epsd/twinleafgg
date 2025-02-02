"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gloom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Gloom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Oddish';
        this.attacks = [{
                name: 'Poisonpowder',
                cost: [card_types_1.CardType.GRASS],
                damage: 0,
                text: 'The Defending Pokémon is now Poisoned.'
            },
            {
                name: 'Foul Odor',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS],
                damage: 20,
                text: 'Both the Defending Pokémon and Gloom are now Confused (after doing damage).'
            }];
        this.set = 'JU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '37';
        this.name = 'Gloom';
        this.fullName = 'Gloom JU';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.POISONED]);
            store.reduceEffect(state, specialConditionEffect);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.addSpecialCondition(card_types_1.SpecialCondition.CONFUSED);
            opponent.active.addSpecialCondition(card_types_1.SpecialCondition.CONFUSED);
        }
        return state;
    }
}
exports.Gloom = Gloom;
