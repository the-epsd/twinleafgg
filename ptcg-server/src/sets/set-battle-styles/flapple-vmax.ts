import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CardTag } from '../../game/store/card/card-types';

export class FlappleVMAX extends PokemonCard {

  public stage: Stage = Stage.VMAX;

  public evolvesFrom = 'Flapple V';

  public regulationMark = 'E';

  public tags = [ CardTag.POKEMON_VMAX ];

  public cardType: CardType = CardType.GRASS;

  public hp: number = 320;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [ ];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [{
    name: 'G-Max Rolling',
    cost: [ CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS ],
    damage: 250,
    text: 'This attack does 10 less damage for each damage counter ' +
    'on this Pokémon.'
  }];

  public set: string = 'BST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '19';

  public name: string = 'Flapple VMAX';

  public fullName: string = 'Flapple VMAX BST';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.damage -= effect.player.active.damage;
      return state;
    }

    return state; 
  }
}

