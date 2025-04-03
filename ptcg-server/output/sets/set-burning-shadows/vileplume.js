"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vileplume = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Vileplume extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Gloom';
        this.cardType = G;
        this.hp = 140;
        this.weakness = [{ type: R }];
        this.retreat = [C, C, C];
        this.powers = [
            {
                name: 'Disgusting Pollen',
                powerType: game_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is your Active Pokémon, your opponent\'s Basic Pokémon can\'t attack.'
            }
        ];
        this.attacks = [
            {
                name: 'Downer Shock',
                cost: [G, G, C],
                damage: 60,
                text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Asleep. If tails, your opponent\'s Active Pokémon is now Confused.'
            },
        ];
        this.set = 'BUS';
        this.setNumber = '6';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Vileplume';
        this.fullName = 'Vileplume BUS';
    }
    reduceEffect(store, state, effect) {
        // Disgusting Pollen
        if (effect instanceof game_effects_1.UseAttackEffect) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            // Return if attacker is not a basic, this Pokemon is not in the opponent's active, or Ability is blocked
            if (!effect.source.isStage(game_1.Stage.BASIC)
                || opponent.active.getPokemonCard() !== this
                || prefabs_1.IS_ABILITY_BLOCKED(store, state, opponent, this)) {
                return state;
            }
            // Check if Ability can target the attacker
            const basicBlockEffect = new game_effects_1.EffectOfAbilityEffect(opponent, this.powers[0], this, state, [effect.source]);
            basicBlockEffect.target = effect.source;
            store.reduceEffect(state, basicBlockEffect);
            if (basicBlockEffect.target === effect.source) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_ABILITY);
            }
        }
        // Downer Shock
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, result => {
                const opponent = game_1.StateUtils.getOpponent(state, effect.player);
                if (result) {
                    prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, opponent, this);
                }
                else {
                    prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, opponent, this);
                }
            });
        }
        return state;
    }
}
exports.Vileplume = Vileplume;
