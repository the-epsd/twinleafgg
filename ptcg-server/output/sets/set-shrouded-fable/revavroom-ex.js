"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Revavroomex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Revavroomex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.POKEMON_TERA];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Varoom';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 280;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Accelerator Flash',
                cost: [card_types_1.CardType.METAL],
                damage: 20,
                damageCalculation: '+',
                text: 'If this Pokémon moved from your Bench to the Active Spot this turn, this attack does 120 more damage.'
            },
            {
                name: 'Shattering Speed',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.METAL, card_types_1.CardType.METAL],
                damage: 250,
                text: 'Discard this Pokémon and all attached cards.'
            },
        ];
        this.set = 'SFA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '15';
        this.name = 'Revavroom ex';
        this.fullName = 'Revavroom ex SFA';
        this.discardRevavroom = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            this.movedToActiveThisTurn = false;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            if (!this.movedToActiveThisTurn) {
                effect.damage = 20;
                return state;
            }
            effect.damage += 120;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const knockOutEffect = new game_effects_1.KnockOutEffect(player, player.active);
            state = store.reduceEffect(state, knockOutEffect);
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
exports.Revavroomex = Revavroomex;
