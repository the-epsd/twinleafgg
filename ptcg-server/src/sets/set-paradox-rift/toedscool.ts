import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { AttackEffect, HealEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

export class Toedscool extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 60;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Kick',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 20,
      text: '',
    },
    {
      name: 'Absorb',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 40,
      text: 'Heal 20 damage from this Pokémon.',
    }
  ];
  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '16';

  public name: string = 'Toedscool';

  public fullName: string = 'Toedscool PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const healEffect = new HealEffect(player, effect.player.active, 20);
      state = store.reduceEffect(state, healEffect);

      return state;
    }
    return state;
  }

}