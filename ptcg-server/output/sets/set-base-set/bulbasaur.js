"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bulbasaur = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_1 = require("../../game");
class Bulbasaur extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Bulbasaur';
        this.cardImage = 'assets/cardback.png';
        this.set = 'BS';
        this.fullName = 'Bulbasaur BS';
        this.setNumber = '44';
        this.cardType = card_types_1.CardType.GRASS;
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 40;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Leech Seed',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS],
                damage: 20,
                text: 'Unless all damage from this attack is prevented, you may remove 1 damage counter from Bulbasaur.'
            }
        ];
        this.attackedThisTurn = false;
        this.opponentsStartingHp = 0;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            this.attackedThisTurn = true;
            this.opponentsStartingHp = game_1.StateUtils.getOpponent(state, effect.player).active.hp;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.active.cards.includes(this) && this.attackedThisTurn) {
            this.attackedThisTurn = false;
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            if (opponent.active.hp < this.opponentsStartingHp) {
                const healEffect = new game_effects_1.HealEffect(effect.player, opponent.active, 10);
                store.reduceEffect(state, healEffect);
            }
        }
        return state;
    }
}
exports.Bulbasaur = Bulbasaur;
