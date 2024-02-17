"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gloom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const select_prompt_1 = require("../../game/store/prompts/select-prompt");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
function* useMiraclePowder(next, store, state, effect) {
    const player = effect.player;
    let flip = false;
    yield store.prompt(state, [
        new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP)
    ], result => {
        flip = result;
        next();
    });
    if (!flip) {
        return state;
    }
    const options = [
        { message: game_message_1.GameMessage.SPECIAL_CONDITION_PARALYZED, value: card_types_1.SpecialCondition.PARALYZED },
        { message: game_message_1.GameMessage.SPECIAL_CONDITION_CONFUSED, value: card_types_1.SpecialCondition.CONFUSED },
        { message: game_message_1.GameMessage.SPECIAL_CONDITION_ASLEEP, value: card_types_1.SpecialCondition.ASLEEP },
        { message: game_message_1.GameMessage.SPECIAL_CONDITION_POISONED, value: card_types_1.SpecialCondition.POISONED },
        { message: game_message_1.GameMessage.SPECIAL_CONDITION_BURNED, value: card_types_1.SpecialCondition.BURNED }
    ];
    return store.prompt(state, new select_prompt_1.SelectPrompt(player.id, game_message_1.GameMessage.CHOOSE_SPECIAL_CONDITION, options.map(c => c.message), { allowCancel: false }), choice => {
        const option = options[choice];
        if (option !== undefined) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [option.value]);
            store.reduceEffect(state, specialConditionEffect);
        }
    });
}
class Gloom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Oddish';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Miracle Powder',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'Flip a coin. If heads, choose 1 Special Condition. ' +
                    'The Defending Pokemon is now affected by that Special Condition.'
            }];
        this.set = 'UD';
        this.name = 'Gloom';
        this.fullName = 'Gloom UD';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '27';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useMiraclePowder(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Gloom = Gloom;
