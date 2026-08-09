import { CardType, Stage } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { PokemonCard, StoreLike, State } from '../../../game';
import { WAS_ATTACK_USED, ADD_CONFUSION_TO_PLAYER_ACTIVE, AFTER_ATTACK } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_FLIPS_COIN_TO_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Octillery extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Remoraid';
  public hp: number = 110;
  public cardType: CardType = W;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Jet of Ink',
      cost: [W],
      damage: 30,
      text: "During your opponent's next turn, if the Defending Pokémon tries to use an attack, your opponent flips 2 coins. If either of them is tails, that attack doesn't happen.",
    },
    {
      name: 'Tantrum',
      cost: [W, C],
      damage: 120,
      text: 'This Pokémon is now Confused.',
    },
  ];

  public regulationMark = 'J';
  public set: string = 'CRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '17';
  public name: string = 'Octillery';
  public fullName: string = 'Octillery M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: DEFENDING_POKEMON_FLIPS_COIN_TO_ATTACK (Smokescreen)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_FLIPS_COIN_TO_ATTACK(store, state, effect, this, 2);
    }

    if (AFTER_ATTACK(effect, 1, this)) {
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.player, this);
    }
    return state;
  }
}
