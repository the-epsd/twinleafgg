import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, SuperType, CoinFlipPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

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

      const coinFlips: CoinFlipPrompt[] = [];
      for (let i = 0; i < energyCount; i++) {
        coinFlips.push(new CoinFlipPrompt(player.id, GameMessage.FLIP_COIN));
      }

      if (coinFlips.length > 0) {
        return store.prompt(state, coinFlips, results => {
          const headsCount = Array.isArray(results) ? results.filter(r => r === true).length : (results === true ? 1 : 0);
          effect.damage = 80 * headsCount;
        });
      } else {
        effect.damage = 0;
      }
    }
    return state;
  }
}