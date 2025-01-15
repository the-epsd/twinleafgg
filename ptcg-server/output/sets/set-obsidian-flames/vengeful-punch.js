"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VengefulPunch = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class VengefulPunch extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '197';
        this.name = 'Vengeful Punch';
        this.fullName = 'Vengeful Punch OBF';
        this.text = 'If the Pokémon this card is attached to is Knocked Out by damage from an attack from your opponent\'s Pokémon, put 4 damage counters on the Attacking Pokémon.';
        this.damageDealt = false;
    }
    reduceEffect(store, state, effect) {
        /*if (effect instanceof AfterDamageEffect && effect.target.tool === this) {
          const player = effect.player;
          const targetPlayer = StateUtils.findOwner(state, effect.target);
      
    
    
          if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
            return state;
          }
      
          const activePokemon = player.active as unknown as PokemonCard;
          const maxHp = activePokemon.hp;
      
          if (state.phase === GamePhase.ATTACK) {
            if (player.active.damage >= maxHp) {
              effect.source.damage += 40;
            }
          }
        }*/
        if ((effect instanceof attack_effects_1.DealDamageEffect || effect instanceof attack_effects_1.PutDamageEffect) &&
            effect.target.tool === this) {
            const player = game_1.StateUtils.getOpponent(state, effect.player);
            if (player.active.tool === this) {
                this.damageDealt = true;
            }
        }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(this) && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (this.damageDealt) {
                opponent.active.damage += 40;
            }
        }
        return state;
    }
}
exports.VengefulPunch = VengefulPunch;
