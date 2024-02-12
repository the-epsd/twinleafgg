"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Accelgor = void 0;
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
class Accelgor extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Shelmet';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [];
        this.attacks = [{
                name: 'Hammer In',
                cost: [card_types_1.CardType.GRASS],
                damage: 20,
                text: ''
            }, {
                name: 'Deck and Cover',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: 'The Defending Pokemon is now Paralyzed and Poisoned. Shuffle this ' +
                    'Pokemon and all cards attached to it into your deck.'
            }];
        this.set = 'DEX';
        this.name = 'Accelgor';
        this.fullName = 'Accelgor DEX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '11';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED, card_types_1.SpecialCondition.POISONED]);
            store.reduceEffect(state, specialConditionEffect);
            player.active.moveTo(player.deck);
            player.active.clearEffects();
            return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
            });
        }
        return state;
    }
}
exports.Accelgor = Accelgor;
