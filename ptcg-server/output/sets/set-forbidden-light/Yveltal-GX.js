"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YveltalGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_2 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
class YveltalGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 180;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Absorb Vitality',
                cost: [card_types_1.CardType.DARK],
                damage: 20,
                text: 'Heal from this Pokémon the same amount of damage you did to your opponent\'s Active Pokémon.'
            },
            {
                name: 'Sonic Evil',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 100,
                text: 'This attack\'s damage isn\'t affected by Weakness or Resistance.'
            },
            {
                name: 'Doom Count-GX',
                cost: [card_types_1.CardType.DARK],
                damage: 0,
                text: 'If your opponent\'s Active Pokémon has exactly 4 damage counters on it, that Pokémon is Knocked Out. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'FLI';
        this.name = 'Yveltal-GX';
        this.fullName = 'Yveltal-GX FLI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '79';
    }
    reduceEffect(store, state, effect) {
        // Absorb Vitality
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const healTime = new attack_effects_1.HealTargetEffect(effect, effect.damage);
            healTime.target = effect.player.active;
            store.reduceEffect(state, healTime);
        }
        // Sonic Evil
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            effect.ignoreResistance = true;
            effect.ignoreWeakness = true;
        }
        // Doom Count-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[2]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // Check if player has used GX attack
            if (player.usedGX == true) {
                throw new game_1.GameError(game_2.GameMessage.LABEL_GX_USED);
            }
            // set GX attack as used for game
            player.usedGX = true;
            // must kill
            if (opponent.active.damage === 40) {
                opponent.active.damage += 999;
            }
        }
        return state;
    }
}
exports.YveltalGX = YveltalGX;
