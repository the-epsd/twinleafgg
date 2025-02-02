"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vulpix = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
class Vulpix extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Vulpix';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '68';
        this.set = 'BS';
        this.fullName = 'Vulpix BS';
        this.cardType = card_types_1.CardType.FIRE;
        this.stage = card_types_1.Stage.BASIC;
        this.evolvesInto = ['Ninetales', 'Ninetales ex', 'Light Ninetales'];
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Confuse Ray',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE],
                damage: 10,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            return store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.COIN_FLIP), (heads) => {
                if (heads) {
                    const condition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.CONFUSED]);
                    store.reduceEffect(state, condition);
                }
            });
        }
        return state;
    }
}
exports.Vulpix = Vulpix;
