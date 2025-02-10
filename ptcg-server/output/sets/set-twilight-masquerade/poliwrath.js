"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Poliwrath = void 0;
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Poliwrath extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Poliwhirl';
        this.cardType = W;
        this.hp = 170;
        this.weakness = [{ type: L }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Hypnosis',
                cost: [W],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Asleep.'
            },
            {
                name: 'Jumping Uppercut',
                cost: [C, C],
                damage: 120,
                damageCalculation: '+',
                text: 'You may do 120 more damage. If you do, shuffle this Pokémon and all attached cards into your deck.'
            },
        ];
        this.set = 'TWM';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '43';
        this.name = 'Poliwrath';
        this.fullName = 'Poliwrath TWM';
        this.shuffleIntoDeck = false;
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            return prefabs_1.CONFIRMATION_PROMPT(store, state, effect.player, (result) => {
                if (!result) {
                    return state;
                }
                effect.damage += 120;
                this.shuffleIntoDeck = true;
            }, game_1.GameMessage.WANT_TO_DEAL_MORE_DAMAGE);
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.shuffleIntoDeck) {
            const player = effect.player;
            player.active.clearEffects();
            this.shuffleIntoDeck = false;
            player.active.moveTo(player.deck);
            prefabs_1.SHUFFLE_DECK(store, state, player);
        }
        return state;
    }
}
exports.Poliwrath = Poliwrath;
