import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class Reshiram extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 130;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Outrage',
      cost: [C, C],
      damage: 20,
      damageCalculation: '+',
      text: 'Does 10 more damage for each damage counter on this Pokémon.'
    },
    {
      name: 'Blue Flare',
      cost: [R, R, C],
      damage: 120,
      text: 'Discard 2 [R] Energy attached to this Pokémon.'
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '21';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Reshiram';
  public fullName: string = 'Reshiram NXD 21';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Outrage
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const damageCounters = Math.floor(player.active.damage / 10);
      effect.damage += damageCounters * 10;
    }

    // Blue Flare
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2, CardType.FIRE);
    }

    return state;
  }
}
