import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class TeamRocketsDugtrio extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Team Rocket\'s Diglett';
  public hp: number = 100;
  public cardType: CardType[] = [F];
  public weakness = [{ type: G }];
  public retreat = [C];

  public powers = [{
    name: 'Holes',
    powerType: PowerType.ABILITY,
    text: 'Whenever your opponent\'s Active Pokémon moves to the Bench during their turn, place 2 damage counters on that Pokémon.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Mud Shot',
    cost: [F, C],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '101';
  public name: string = 'Team Rocket\'s Dugtrio';
  public fullName: string = 'Team Rocket\'s Dugtrio ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Holes
    if (WAS_POWER_USED(effect, 0, this)) {
      // TODO unmatched: "Whenever your opponent's Active Pokemon moves to the Bench during their turn, place 2 damage counters on that Pokemon."
      return state;
    }

    return state;
  }
}
