import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class GalarianYamask extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public regulationMark = 'D';
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks =
    [
      {
        name: 'Reckless Charge',
        cost: [C, C],
        damage: 50,
        text: 'This Pokémon also does 30 damage to itself.'
      },
    ];

  public set: string = 'RCL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '101';
  public name: string = 'Galarian Yamask';
  public fullName: string = 'Galarian Yamask RCL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 30);
    }

    return state;
  }
}