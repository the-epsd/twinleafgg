import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, HealEffect } from '../../game/store/effects/game-effects';

export class Chikorita extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 70;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Mini Drain',
    cost: [CardType.GRASS],
    damage: 10,
    text: 'Heal 10 damage from this Pokémon.'
  }
  ];

  public set: string = 'LOT';
  public fullName: string = 'Chikorita LOT 6';
  public name: string = 'Chikorita';
  public setNumber: string = '6';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const target = player.active;
      const healEffect = new HealEffect(player, target, 10);
      state = store.reduceEffect(state, healEffect);
      return state;
    }

    return state;
  }
}