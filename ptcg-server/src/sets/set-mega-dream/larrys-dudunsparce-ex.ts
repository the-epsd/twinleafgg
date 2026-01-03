import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { GameMessage } from '../../game';

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
    text: 'Flip a coin for each Energy attached to this Pokemon. This attack does 80 damage for each heads.'
  }];

  public regulationMark: string = 'I';
  public set: string = 'M2a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name: string = 'Larry\'s Dudunsparce ex';
  public fullName: string = 'Larry\'s Dudunsparce ex M2a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
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


