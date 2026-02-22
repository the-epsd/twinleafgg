import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';

import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Pupitar extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Larvitar';
  public cardType: CardType = CardType.FIGHTING;
  public hp: number = 90;
  public weakness = [{ type: CardType.GRASS }];
  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Take Down',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 60,
      text: 'This Pokémon also does 20 damage to itself.'
    }
  ];

  public set: string = 'JTG';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '81';
  public name: string = 'Pupitar';
  public fullName: string = 'Pupitar JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const damageEffect = new PutDamageEffect(effect, 20);
      damageEffect.target = player.active;
      store.reduceEffect(state, damageEffect);
    }

    return state;
  }

}