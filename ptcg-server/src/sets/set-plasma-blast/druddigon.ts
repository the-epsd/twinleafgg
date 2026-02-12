import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS } from '../../game/store/prefabs/attack-effects';

export class Druddigon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = N;
  public hp: number = 100;
  public weakness = [{ type: N }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Big Swing',
      cost: [R],
      damage: 40,
      text: 'Flip 2 coins. If either of them is tails, this attack does nothing.'
    },
    {
      name: 'Shred',
      cost: [W, C, C],
      damage: 60,
      text: 'This attack\'s damage isn\'t affected by any effects on the Defending Pokémon.'
    }
  ];

  public set: string = 'PLB';
  public setNumber: string = '70';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Druddigon';
  public fullName: string = 'Druddigon PLB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Big Swing - both coins must be heads
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        if (results.some(r => !r)) {
          effect.damage = 0;
        }
      });
    }

    // Attack 2: Shred - ignore effects on defending Pokemon
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS(store, state, effect, 60);
    }

    return state;
  }
}
