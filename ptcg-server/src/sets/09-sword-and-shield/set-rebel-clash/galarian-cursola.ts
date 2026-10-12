import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, StateUtils } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { KnockOutEffect } from "../../../game/store/effects/game-effects";
import { CAN_APPLY_ABILITY_TO_TARGET } from "../../../game/store/prefabs/effect-of-ability-prefabs";
import { IS_ABILITY_BLOCKED, COIN_FLIP_PROMPT, WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";
import { BLOCK_RETREAT } from "../../../game/store/prefabs/effect-of-attack-prefabs";

export class GalarianCursola extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Galarian Corsola';
  public cardType: CardType[] = [P];
  public hp: number = 100;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Perish Body',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is in the Active Spot and is Knocked Out by damage from an opponent\'s attack, flip a coin. If heads, the Attacking Pokémon is Knocked Out.'
  }];

  public attacks = [{
    name: 'Corner',
    cost: [P, C],
    damage: 60,
    text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
  }];

  public regulationMark: string = 'D';

  public set: string = 'RCL';
  public setNumber: string = '79';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Galarian Cursola';
  public fullName: string = 'Galarian Cursola RCL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Perish Body — Ref: set-30th-celebration/gengar-ex.ts
    if (
      effect instanceof KnockOutEffect &&
      effect.target.cards.includes(this) &&
      effect.player.active === effect.target &&
      effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)
    ) {
      const abilityOwner = effect.player;
      const attackerOwner = StateUtils.getOpponent(state, abilityOwner);

      if (IS_ABILITY_BLOCKED(store, state, abilityOwner, this)) {
        return state;
      }

      COIN_FLIP_PROMPT(store, state, abilityOwner, flipResult => {
        if (!flipResult) {
          return;
        }
        if (!CAN_APPLY_ABILITY_TO_TARGET(
          store,
          state,
          abilityOwner,
          this.powers[0],
          this,
          attackerOwner.active,
        )) {
          return;
        }
        attackerOwner.active.damage += 999;
      });
    }

    // Corner
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }
    return state;
  }
}
