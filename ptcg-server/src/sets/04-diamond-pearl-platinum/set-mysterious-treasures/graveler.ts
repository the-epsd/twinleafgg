import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_DAMAGE_PER_HEADS } from '../../../game/store/prefabs/attack-effects';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Graveler extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Geodude';
  public hp: number = 90;
  public cardType: CardType[] = [F];
  public weakness = [{ type: G, value: +20 }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Rock Cannon',
    cost: [F, C],
    damage: 30,
    damageCalculation: 'x',
    text: 'Flip a coin until you get tails. This attack does 30 damage times the number of heads.'
  },
  {
    name: 'Rock Slide',
    cost: [F, C, C],
    damage: 40,
    text: 'Does 10 damage to 2 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '51';
  public name: string = 'Graveler';
  public fullName: string = 'Graveler MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Rock Cannon
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_DAMAGE_PER_HEADS(store, state, effect, 30);
    }

    // Rock Slide
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON(10, effect, store, state, 2, 2);
    }

    return state;
  }
}
