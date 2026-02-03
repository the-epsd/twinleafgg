import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { StoreLike } from '../../game/store/store-like';
import { State, GamePhase } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game';
import { DealDamageEffect, PutCountersEffect } from '../../game/store/effects/attack-effects';
import { IS_SPECIAL_ENERGY_BLOCKED } from '../../game/store/prefabs/prefabs';


export class SpikyEnergy extends EnergyCard {

  public provides: CardType[] = [C];

  public energyType = EnergyType.SPECIAL;

  public regulationMark = 'I';

  public set: string = 'JTG';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '159';

  public name = 'Spiky Energy';

  public fullName = 'Spiky Energy JTG';

  public text =
    'As long as this card is attached to a Pokémon, it provides [C] Energy. \n' +
    'If the Pokémon this card is attached to is in the Active Spot and is damaged by an attack ' +
    'from your opponent\'s Pokémon (even if it is Knocked Out), put 2 damage counters on the Attacking Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof DealDamageEffect && effect.target.cards.includes(this) && state.phase === GamePhase.ATTACK) {
      const player = StateUtils.findOwner(state, effect.target);
      const opponent = effect.player;
      if (player === opponent || player.active !== effect.target)
        return state;

      if (IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.player, this, effect.target)) {
        return state;
      }
      const putCountersEffect = new PutCountersEffect(effect, 20);
      putCountersEffect.target = effect.source;
      store.reduceEffect(state, putCountersEffect);
    }
    return state;
  }

}
