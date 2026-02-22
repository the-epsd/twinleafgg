import { PokemonCard, Stage, CardType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Tropius extends PokemonCard {

  public stage = Stage.BASIC;
  public cardType = CardType.GRASS;
  public hp = 110;

  public weakness = [{ type: CardType.FIRE }];
  public resistance = [];
  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Rally Back',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: 30,
      text: 'If any of your Pokémon were Knocked Out by damage from an attack from your opponent\'s Pokémon during their last turn, this attack does 90 more damage.'
    },
    {
      name: 'Solar Beam',
      cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS],
      damage: 100,
      text: ''
    }
  ];

  public set: string = 'EVS';

  public regulationMark = 'E';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '6';

  public name: string = 'Tropius';

  public fullName: string = 'Tropius EVS';

  // public damageDealt = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.marker.hasMarker(MarkerConstants.REVENGE_MARKER)) {
        effect.damage += 90;
      }

      return state;
    }

    // if ((effect instanceof DealDamageEffect || effect instanceof PutDamageEffect) &&
    //   effect.target.tools.includes(this)) {
    //   const player = StateUtils.getOpponent(state, effect.player);

    //   if (player.active.tools.includes(this)) {
    //     this.damageDealt = true;
    //   }
    // }
    return state;
  }
}
