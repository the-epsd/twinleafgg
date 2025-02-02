import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, HealEffect } from '../../game/store/effects/game-effects';

export class Copperajah extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Cufant';

  public cardType: CardType = CardType.METAL;

  public hp: number = 190;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Dig Drain',
      damage: 60,
      cost: [CardType.METAL, CardType.METAL],
      text: 'Heal 30 damage from this Pokémon.'
    },
    {
      name: 'Muscular Nose',
      cost: [CardType.METAL, CardType.METAL, CardType.METAL],
      damage: 220,
      text: 'If this Pokémon has 8 or more damage counters on it, this attack does nothing.'
    }
  ];

  public regulationMark: string = 'D';

  public set: string = 'SSH';

  public name: string = 'Copperajah';

  public fullName: string = 'Copperajah SSH';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '137';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      
      const healEffect = new HealEffect(player, effect.player.active, 30);
      store.reduceEffect(state, healEffect);
      return state;
    }
    
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      
      if (player.active.damage >= 80) {
        effect.damage = 0;
        return state;
      }

      return state;
    }
    
    return state;
  }
}
