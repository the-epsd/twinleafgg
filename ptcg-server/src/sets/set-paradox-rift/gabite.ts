import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/prefabs';

export class Gabite extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public regulationMark = 'G';

  public evolvesFrom = 'Gible';

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 100;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [{
    name: 'Power Blast',
    cost: [ CardType.FIGHTING ],
    damage: 50,
    text: 'Discard an Energy from this Pokémon.',
    effect: (store: StoreLike, state: State, effect: AttackEffect) => {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, CardType.COLORLESS, 1);
    }
  },
  ];

  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '28';

  public name: string = 'Gabite';

  public fullName: string = 'Gabite PAR';
}