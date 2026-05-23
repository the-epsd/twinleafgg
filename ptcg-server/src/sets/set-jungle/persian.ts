import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Persian extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 70;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.PSYCHIC, value: -30 }];

  public evolvesFrom = 'Meowth';

  public attacks = [{
    name: 'Scratch',
    cost: [C, C],
    damage: 20,
    text: ''
  },
  {
    name: 'Pounce',
    cost: [C, C, C],
    damage: 30,
    text: 'If the Defending Pokémon attacks Persian during your opponent\'s next turn, any damage done by the attack is reduced by 10 (after applying Weakness and Resistance). (Benching either Pokémon ends this effect.)'
  }];

  public set: string = 'JU';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '42';

  public name: string = 'Persian';

  public fullName: string = 'Persian JU';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.player.active.damageReductionNextTurn = 10;
    }

    return state;
  }
}