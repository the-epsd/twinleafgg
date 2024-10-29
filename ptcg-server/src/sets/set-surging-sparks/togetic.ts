import { PokemonCard, Stage, CardType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, HealEffect } from '../../game/store/effects/game-effects';
export class Togetic extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Togepi';
  public cardType: CardType = P;
  public hp: number = 90;
  public weakness = [{ type: M }];
  public resistance = [];
  public retreat = [C];

  public attacks = [
    {
      name: 'Drain Kiss',
      cost: [C, C],
      damage: 30,
      text: 'Heal 30 damage from this Pokémon.'
    }
  ];

  public regulationMark = 'H';
  public set: string = 'SSP';
  public setNumber: string = '71';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Togetic';
  public fullName: string = 'Togetic SV8';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const target = player.active;
      const healEffect = new HealEffect(player, target, 30);
      state = store.reduceEffect(state, healEffect);
      return state;
    }

    return state;
  }
}