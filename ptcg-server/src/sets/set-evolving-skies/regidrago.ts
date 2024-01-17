import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Regidrago extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 130;

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Hammer In',
      cost: [ CardType.COLORLESS, CardType.COLORLESS ],
      damage: 30,
      text: ''
    },
    {
      name: 'Dragon Energy',
      cost: [ CardType.GRASS, CardType.GRASS, CardType.FIRE ],
      damage: 240,
      text: 'This attack does 20 less damage for each damage counter on this Pokémon.'
    }
  ];

  public set: string = 'EVS';

  public regulationMark = 'E';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '124';

  public name: string = 'Regidrago';

  public fullName: string = 'Regidrago EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const damage = Math.max(0, 240 - (player.active.damage / 20));
      effect.damage = damage;
    }
    return state;
  }
}