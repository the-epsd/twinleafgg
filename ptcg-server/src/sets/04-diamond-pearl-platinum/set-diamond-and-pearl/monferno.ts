import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { SlotType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Monferno extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Chimchar';
  public hp: number = 70;
  public cardType: CardType[] = [R];
  public weakness = [{ type: W, value: 20 }];
  public retreat = [];

  public attacks = [{
    name: 'Flame Dance',
    cost: [R],
    damage: 30,
    text: 'Search your discard pile for a Fire Energy card and attach it to Monferno.'
  },
  {
    name: 'Fury Swipes',
    cost: [C, C],
    damage: 20,
    damageCalculation: 'x',
    text: 'Flip 3 coins. This attack does 20 damage times the number of heads.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '56';
  public name: string = 'Monferno';
  public fullName: string = 'Monferno DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Flame Dance
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON(store, state, player, 1, CardType.FIRE, {
        destinationSlots: [SlotType.ACTIVE],
        min: 0,
      });
    }

    // Fury Swipes
    if (WAS_ATTACK_USED(effect, 1, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 3, results => {
        effect.damage = 20 * results.filter(r => r).length;
      });
    }

    return state;
  }
}
