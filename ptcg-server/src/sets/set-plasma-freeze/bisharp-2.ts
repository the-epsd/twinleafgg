import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON } from '../../game/store/prefabs/attack-effects';

export class Bisharp2 extends PokemonCard {
  public tags = [CardTag.TEAM_PLASMA];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Pawniard';
  public cardType: CardType = D;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Cut Down',
      cost: [C, C],
      damage: 30,
      text: 'Flip a coin. If heads, discard an Energy attached to the Defending Pokémon.'
    },
    {
      name: 'Slicing Blade',
      cost: [D, C, C],
      damage: 70,
      text: ''
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '74';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Bisharp';
  public fullName: string = 'Bisharp PLF 74';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, state, effect);
        }
      });
    }

    return state;
  }
}
