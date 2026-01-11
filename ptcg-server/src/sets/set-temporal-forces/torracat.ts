import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Torracat extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Litten';
  public cardType: CardType = R;
  public hp: number = 100;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Bite',
    cost: [R],
    damage: 30,
    text: ''
  },
  {
    name: 'Flare Strike',
    cost: [R, C, C],
    damage: 80,
    text: 'During your next turn, this Pokémon can\'t use Flare Strike.'
  }];

  public regulationMark: string = 'H';
  public set: string = 'TEF';
  public setNumber = '33';
  public cardImage = 'assets/cardback.png';
  public name: string = 'Torracat';
  public fullName: string = 'Torracat TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      if (!player.active.cannotUseAttacksNextTurnPending.includes('Flare Strike')) {
        player.active.cannotUseAttacksNextTurnPending.push('Flare Strike');
      }
    }
    return state;
  }
}