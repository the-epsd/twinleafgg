import { Effect } from '../../../game/store/effects/effect';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { StoreLike, State } from '../../../game';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';

import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_FLIPS_COIN_TO_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Seadra extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Horsea';
  public cardType: CardType[] = [F];
  protected _tags = [CardTag.DELTA_SPECIES];
  public hp: number = 70;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Smokescreen',
      cost: [C, C],
      damage: 20,
      text: "If the Defending Pokémon tries to attack during your opponent's next turn, your opponent flips a coin.If tails, that attack does nothing.",
    },
    {
      name: 'Razor Wing',
      cost: [F, C, C],
      damage: 40,
      text: '',
    },
  ];

  public set: string = 'DF';
  public name: string = 'Seadra';
  public fullName: string = 'Seadra DF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '22';

    public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: DEFENDING_POKEMON_FLIPS_COIN_TO_ATTACK (Smokescreen)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_FLIPS_COIN_TO_ATTACK(store, state, effect, this);
    }

    return state;
  }
}
