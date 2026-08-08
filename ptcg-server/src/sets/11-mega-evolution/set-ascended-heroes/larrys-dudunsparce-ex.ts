import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, SuperType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';

import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../../game/store/prefabs/prefabs';

export class LarrysDudunsparceex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Larry\'s Dunsparce';
  public tags = [CardTag.POKEMON_ex, CardTag.LARRYS];
  public cardType: CardType = C;
  public hp: number = 270;
  public weakness = [{ type: F }];
  public resistance = [];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Work Rush',
    cost: [C, C, C],
    damage: 80,
    damageCalculation: 'x',
    text: 'Flip a coin for each Energy attached to this Pokémon. This attack does 80 damage for each heads.'
  }];

  public regulationMark: string = 'I';

  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '164';
  public name: string = 'Larry\'s Dudunsparce ex';
  public fullName: string = 'Larry\'s Dudunsparce ex MC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const energyCount = player.active.energies.cards.filter(card =>
        card.superType === SuperType.ENERGY
      ).length;

      if (energyCount > 0) {
        return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, energyCount, results => {
          const headsCount = results.filter(r => r === true).length;
          effect.damage = 80 * headsCount;
        });
      } else {
        effect.damage = 0;
      }
    }
    return state;
  }
}
