"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Abra = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
class Abra extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Abra';
        this.cardImage = 'assets/cardback.png';
        this.set = 'BS';
        this.fullName = 'Abra BS';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.setNumber = '43';
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 30;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Psyshock',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 10,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            return store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.COIN_FLIP), (heads) => {
                if (heads) {
                    const condition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED]);
                    store.reduceEffect(state, condition);
                }
            });
        }
        return state;
    }
}
exports.Abra = Abra;
