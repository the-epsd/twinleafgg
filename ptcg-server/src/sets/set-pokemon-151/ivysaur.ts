import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { HealEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Ivysaur extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Bulbasaur';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 100;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Leech Seed',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: 30,
      text: 'Heal 20 damage from this Pokémon.',
    },
    {
      name: 'Vine Whip',
      cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS],
      damage: 80,
      text: '',
    }
  ];

  public set: string = 'MEW';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '2';

  public name: string = 'Ivysaur';

  public fullName: string = 'Ivysaur MEW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const healEffect = new HealEffect(player, effect.player.active, 20);
      store.reduceEffect(state, healEffect);
      return state;
    }
    return state;
  }
}