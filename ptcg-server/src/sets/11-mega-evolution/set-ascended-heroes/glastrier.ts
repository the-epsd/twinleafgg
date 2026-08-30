import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON } from '../../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Glastrier extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 130;
  public cardType: CardType[] = [W];
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Ice Shot',
    cost: [W],
    damage: 20,
    text: 'This attack also does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Frosty Typhoon',
    cost: [W, W, W],
    damage: 130,
    text: 'During your next turn, this Pokémon can\'t use Frosty Typhoon.'
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '54';
  public name: string = 'Glastrier';
  public fullName: string = 'Glastrier ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ice Shot
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(20, effect, store, state);
    }

    // Frosty Typhoon
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.active.cannotUseAttacksNextTurnPending.push('Frosty Typhoon');
    }

    return state;
  }
}
