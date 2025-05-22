import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Larvitar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 50;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Light Punch',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Dig Drain',
    cost: [F, C],
    damage: 20,
    text: 'Remove 1 damage counter from Larvitar.'
  }];

  public set: string = 'TRR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '63';
  public name: string = 'Larvitar';
  public fullName: string = 'Larvitar TRR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 10);
    }

    return state;
  }
}