import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

export class Basculin extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [ CardTag.RAPID_STRIKE ];

  public regulationMark = 'E';

  public cardType: CardType = CardType.WATER;

  public hp: number = 80;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Swarm the Wound',
      cost: [ CardType.WATER, CardType.COLORLESS ],
      damage: 30,
      text: 'This attack does 10 more damage for each damage counter on your opponent\'s Active Pokémon.'
    },
  ];

  public set: string = 'FST';

  public cardImage: string = 'assets/cardback.png';
  
  public setNumber: string = '70';

  public name: string = 'Basculin';

  public fullName: string = 'Basculin FST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      effect.damage += opponent.active.damage;
      return state;
    }
    return state;
  }
}