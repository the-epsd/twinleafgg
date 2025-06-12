import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Ralts extends PokemonCard {
  public tags = [CardTag.DELTA_SPECIES];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 50;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Calm Mind',
    cost: [C],
    damage: 0,
    text: 'Remove 2 damage counters from Ralts.'
  },
  {
    name: 'Will-o\'-the-wisp',
    cost: [R, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'DF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '61';
  public name: string = 'Ralts';
  public fullName: string = 'Ralts DF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 20);
    }

    return state;
  }
}