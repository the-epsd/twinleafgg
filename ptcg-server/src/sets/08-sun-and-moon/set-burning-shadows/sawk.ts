import { CardType, PokemonCard, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS } from '../../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Sawk extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [F];
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Quick Guard',
    cost: [F],
    damage: 0,
    text: 'Prevent all damage done to this Pokémon by attacks from Basic Pokémon during your opponent\'s next turn. This Pokémon can\'t use Quick Guard during your next turn.'
  },
  {
    name: 'Brick Break',
    cost: [F, C],
    damage: 40,
    shredAttack: true,
    text: 'This attack\'s damage isn\'t affected by Resistance or any effects on your opponent\'s Active Pokémon.'
  }];

  public set: string = 'BUS';
  public setNumber: string = '72';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Sawk';
  public fullName: string = 'Sawk BUS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Quick Guard
    if (WAS_ATTACK_USED(effect, 0, this)) {
      PREVENT_DAMAGE(store, state, effect, this, { sourceStage: Stage.BASIC });
      effect.player.active.cannotUseAttacksNextTurnPending.push('Quick Guard');
    }

    // Brick Break
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.ignoreResistance = true;
      THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS(store, state, effect, 40);
    }

    return state;
  }
}
