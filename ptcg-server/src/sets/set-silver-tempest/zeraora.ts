import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Zeraora extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'F';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 110;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [];

  public attacks = [
    {
      name: 'Battle Claw',
      cost: [CardType.LIGHTNING],
      damage: 30,
      damageCalculation: '+',
      text: 'If your opponent\'s Active Pokémon is an Evolution Pokémon, this attack does 30 more damage.'
    },
    {
      name: 'Mach Bolt',
      cost: [CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS],
      damage: 80,
      text: ''
    }
  ];

  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '56';

  public name: string = 'Zeraora';

  public fullName: string = 'Zeraora SIT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.isStage(Stage.BASIC)) {
        return state;
      } else {
        effect.damage += 30;
      }
      return state;
    }
    return state;
  }
}