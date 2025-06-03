import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class ArvensToedscool extends PokemonCard {
  public regulationMark = 'I';
  public tags = [CardTag.ARVENS];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Slight Intrusion',
      cost: [C],
      damage: 30,
      text: 'This Pokémon also does 10 damage to itself.'
    }
  ];

  public set: string = 'DRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '109';
  public name: string = 'Arven\'s Toedscool';
  public fullName: string = 'Arven\'s Toedscool DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 10);
    }

    return state;
  }
}