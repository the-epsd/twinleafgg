import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';


export class Morpeko extends PokemonCard {

  public tags = [ CardTag.SINGLE_STRIKE ];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 50;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Explosive Discontent',
      cost: [ CardType.DARK ],
      damage: 30,
      text: 'This attack does 30 damage for each damage counter on this Pokémon.'
    }
  ];

  public set: string = 'FST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '179';

  public name: string = 'Morpeko';

  public fullName: string = 'Morpeko FST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.damage = effect.player.active.damage * 30;
      return state;
    }

    return state;
  }

}
