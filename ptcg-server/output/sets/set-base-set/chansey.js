"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chansey = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Chansey extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 120;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Scrunch',
                cost: [C, C],
                damage: 0,
                text: 'Flip a coin. If heads, prevent all damage done to Chansey during your opponent\'s next turn. (Any other effects of attacks still happen.)'
            },
            {
                name: 'Double-edge',
                cost: [C, C, C, C],
                damage: 80,
                text: 'Chansey does 80 damage to itself.'
            }
        ];
        this.set = 'BS';
        this.fullName = 'Chansey BS';
        this.name = 'Chansey';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '3';
        this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = 'PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER';
        this.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = 'CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            try {
                const coinFlip = new play_card_effects_1.CoinFlipEffect(player);
                store.reduceEffect(state, coinFlip);
            }
            catch (_a) {
                return state;
            }
            const coinFlipResult = prefabs_1.SIMULATE_COIN_FLIP(store, state, player);
            if (coinFlipResult) {
                player.active.marker.addMarker(this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
                opponent.marker.addMarker(this.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
            }
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 80);
            dealDamage.target = player.active;
            return store.reduceEffect(state, dealDamage);
        }
        if (effect instanceof attack_effects_1.AbstractAttackEffect
            && effect.target.marker.hasMarker(this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER)) {
            effect.preventDefault = true;
            return state;
        }
        if (effect instanceof attack_effects_1.PutDamageEffect
            && effect.target.marker.hasMarker(this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER)) {
            effect.preventDefault = true;
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect
            && effect.player.marker.hasMarker(this.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
            });
        }
        return state;
    }
}
exports.Chansey = Chansey;
