import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_BENCHED_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class CynthiasMilotic extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Cynthia\'s Feebas';
  public tags = [CardTag.CYNTHIAS];
  public cardType: CardType = W;
  public hp: number = 130;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Aqua Split',
      cost: [W, C],
      damage: 60,
      text: 'This attack also does 30 damage to 2 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'DRI';
  public setNumber: string = '53';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cynthia\'s Milotic';
  public fullName: string = 'Cynthia\'s Milotic DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Aqua Split
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_BENCHED_POKEMON(30, effect, store, state, 1, 2);
    }

    return state;
  }
}