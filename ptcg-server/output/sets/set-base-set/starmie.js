"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Starmie = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
class Starmie extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Starmie';
        this.cardImage = 'assets/cardback.png';
        this.set = 'BS';
        this.setNumber = '64';
        this.cardType = card_types_1.CardType.WATER;
        this.fullName = 'Starmie';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Staryu';
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Recover',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER],
                text: 'Discard 1 {W} Energy card attached to Starmie in order to use this attack. Remove all damage counters from Starmie.',
                damage: 0
            },
            {
                name: 'Star Freeze',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            prefabs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, card_types_1.CardType.WATER, 1);
            const player = effect.player;
            const heal = new game_effects_1.HealEffect(player, player.active, player.active.damage);
            heal.target = effect.player.active;
            store.reduceEffect(state, heal);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
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
exports.Starmie = Starmie;
