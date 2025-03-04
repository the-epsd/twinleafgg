import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import {HealTargetEffect} from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import {  WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Applin extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public regulationMark = 'I';
  public cardType: CardType = G;
  public hp: number = 40;
  public weakness = [{ type: R }];
  public retreat = [ C ];

  public attacks = [{
    name: 'Mini Drain',
    cost: [ G ],
    damage: 10,
    text: 'Heal 10 damage from this Pokémon.'
  }];

  public set: string = 'SV9a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '9';
  public name: string = 'Applin';
  public fullName: string = 'Applin SV9a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Mini Drain
    if (WAS_ATTACK_USED(effect, 0, this)){
      const healing = new HealTargetEffect(effect, 10);
      healing.target = effect.player.active;
      store.reduceEffect(state, healing);
    }

    return state;
  }
}