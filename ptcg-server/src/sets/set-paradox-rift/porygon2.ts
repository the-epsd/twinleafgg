import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/prefabs';

export class Porygon2 extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Porygon';
  
  public regulationMark = 'G';  

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 90;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Powered Ball',
    cost: [CardType.COLORLESS],
    damage: 50,
    text: 'Discard an Energy from this Pokémon.'
  }];

  public set: string = 'PAR';

  public name: string = 'Porygon2';

  public fullName: string = 'Porygon2 PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '143';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, CardType.COLORLESS, 1)
    }

    return state;
  }
}