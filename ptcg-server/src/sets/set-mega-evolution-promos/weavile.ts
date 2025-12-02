import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Weavile extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Sneasel';
  public cardType: CardType = D;
  public hp: number = 100;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Claws of Retribution',
    cost: [D, D],
    damage: 20,
    damageCalculation: '+',
    text: 'If this Pokémon has 50 HP or less remaining, this attack does 170 more damage.',
  },
  {
    name: 'Cut',
    cost: [D, D],
    damage: 60,
    text: '',
  }];

  public set: string = 'MEP';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '21';
  public name: string = 'Weavile';
  public fullName: string = 'Weavile M2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.active.hp <= 50) {
        effect.damage += 170;
      }
    }
    return state;
  }
}