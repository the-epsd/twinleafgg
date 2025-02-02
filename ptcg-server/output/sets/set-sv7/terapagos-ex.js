"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Terapagosex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Terapagosex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.POKEMON_TERA, card_types_1.CardTag.HOLO];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 230;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Unified Beatdown',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                damageCalculation: 'x',
                text: 'If you go second, you can\'t use this attack during your first turn.This attack does 30 damage for each of your Benched Pokémon.'
            },
            {
                name: 'Crown Opal',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.WATER, card_types_1.CardType.LIGHTNING],
                damage: 180,
                damageCalculation: '+',
                text: 'During your opponent\'s next turn, prevent all damage done to this Pokémon by attacks from Basic non-[C] Pokémon.'
            },
        ];
        this.set = 'SCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '128';
        this.name = 'Terapagos ex';
        this.fullName = 'Terapagos ex SV7';
        this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = 'PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER';
        this.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = 'CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            if (state.turn <= 2) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            const player = effect.player;
            const playerBench = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            const totalBenched = playerBench;
            effect.damage = totalBenched * 30;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.marker.hasMarker(this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActive = opponent.active.getPokemonCard();
            if (opponent.active.isBasic() && opponent.active.stage == card_types_1.Stage.BASIC && (opponentActive === null || opponentActive === void 0 ? void 0 : opponentActive.cardType) !== card_types_1.CardType.COLORLESS) {
                effect.preventDefault = true;
                return state;
            }
            return state;
        }
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Target is not Active
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            // Target is this Pokemon
            if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
                effect.preventDefault = true;
            }
        }
        return state;
    }
}
exports.Terapagosex = Terapagosex;
