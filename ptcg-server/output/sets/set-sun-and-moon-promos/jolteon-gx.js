"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JolteonGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const state_utils_1 = require("../../game/store/state-utils");
const attack_effects_2 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
// SMP Jolteon-GX 173 (https://limitlesstcg.com/cards/SMP/173)
class JolteonGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 200;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.METAL, value: -20 }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Electrobullet',
                cost: [card_types_1.CardType.LIGHTNING],
                damage: 30,
                text: 'This attack does 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Head Bolt',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 110,
                text: ''
            },
            {
                name: 'Swift Run-GX',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 110,
                text: 'Prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'SMP';
        this.setNumber = 'SM173';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Jolteon-GX';
        this.fullName = 'Jolteon-GX SMP';
        // for the GX attack
        this.ECLIPSE_MARKER = 'ECLIPSE_MARKER';
        this.CLEAR_ECLIPSE_MARKER = 'CLEAR_ECLIPSE_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Electrobullet
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const damageEffect = new attack_effects_2.PutDamageEffect(effect, 30);
                damageEffect.target = targets[0];
                store.reduceEffect(state, damageEffect);
            });
        }
        // Swift Run-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[2]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // Check if player has used GX attack
            if (player.usedGX == true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            // set GX attack as used for game
            player.usedGX = true;
            player.active.marker.addMarker(this.ECLIPSE_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_ECLIPSE_MARKER, this);
        }
        if (effect instanceof attack_effects_1.AbstractAttackEffect
            && effect.target.marker.hasMarker(this.ECLIPSE_MARKER)) {
            effect.preventDefault = true;
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_ECLIPSE_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_ECLIPSE_MARKER, this);
            const opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.ECLIPSE_MARKER, this);
            });
        }
        return state;
    }
}
exports.JolteonGX = JolteonGX;
