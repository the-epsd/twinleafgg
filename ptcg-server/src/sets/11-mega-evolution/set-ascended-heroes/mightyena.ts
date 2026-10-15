import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { SWITCH_OUT_OPPONENT_ACTIVE_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Mightyena extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Poochyena';
  public hp: number = 120;
  public cardType: CardType[] = [D];
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Kick Away',
    cost: [D, C],
    damage: 50,
    text: 'Switch out your opponent\'s Active Pokémon to the Bench. (Your opponent chooses the new Active Pokémon.)'
  },
{
    name: 'Sharp Fang',
    cost: [D, D, C],
    damage: 130,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '129';
  public name: string = 'Mightyena';
  public fullName: string = 'Mightyena ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Kick Away
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      SWITCH_OUT_OPPONENT_ACTIVE_POKEMON(store, state, player, { allowCancel: false });
    }

    return state;
  }
}
