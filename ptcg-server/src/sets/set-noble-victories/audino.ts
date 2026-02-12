import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, HEAL_X_DAMAGE_FROM_THIS_POKEMON } from '../../game/store/prefabs/prefabs';

export class Audino extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Heal Pulse',
      cost: [C],
      damage: 0,
      text: 'Heal 30 damage from this Pokémon.'
    },
    {
      name: 'Return',
      cost: [C, C],
      damage: 10,
      damageCalculation: 'x',
      text: 'Does 10 damage times the number of your Benched Pokémon.'
    }
  ];

  public set: string = 'NVI';
  public setNumber: string = '85';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Audino';
  public fullName: string = 'Audino NVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Heal Pulse
    if (WAS_ATTACK_USED(effect, 0, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 30);
    }

    // Return - 10x number of benched Pokémon
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const benchCount = player.bench.filter(b => b.cards.length > 0).length;
      effect.damage = 10 * benchCount;
    }

    return state;
  }
}
