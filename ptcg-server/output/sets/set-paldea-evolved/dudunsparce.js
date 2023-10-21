"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dudunsparce = void 0;
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
class Dudunsparce extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Dunsparce';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 140;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Mud-Slap',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }, {
                name: 'Deck and Cover',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 100,
                text: 'Your opponent\'s Active Pokémon is now Paralyzed. Shuffle this Pokémon and all attached cards into your deck.'
            }];
        this.regulationMark = 'G';
        this.set = 'PAL';
        this.set2 = 'paldeaevolved';
        this.setNumber = '157';
        this.name = 'Dudunsparce';
        this.fullName = 'Dudunsparce PAL';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED]);
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
exports.Dudunsparce = Dudunsparce;
