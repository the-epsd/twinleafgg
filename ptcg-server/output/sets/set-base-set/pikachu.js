"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pikachu = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
class Pikachu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Pikachu';
        this.cardImage = 'assets/cardback.png';
        this.set = 'BS';
        this.setNumber = '58';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.fullName = 'Pikachu BS';
        this.stage = card_types_1.Stage.BASIC;
        this.evolvesInto = ['Raichu', 'Alolan Raichu', 'Raichu-GX', 'Dark Raichu', 'Raichu ex'];
        this.hp = 40;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Gnaw',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: ''
            },
            {
                name: 'Thunder Jolt',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'Flip a coin. If tails, Pikachu does 10 damage to itself.'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            return store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.COIN_FLIP), (heads) => {
                if (!heads) {
                    const damage = new attack_effects_1.DealDamageEffect(effect, 10);
                    damage.target = effect.player.active;
                    store.reduceEffect(state, damage);
                }
            });
        }
        return state;
    }
}
exports.Pikachu = Pikachu;
