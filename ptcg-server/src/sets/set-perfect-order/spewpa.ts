import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { GameMessage } from '../../game';
import { WAS_ATTACK_USED, PREVENT_DAMAGE } from '../../game/store/prefabs/prefabs';

export class Spewpa extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Scatterbug';
  public cardType: CardType = G;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Hide',
    cost: [G],
    damage: 0,
    text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all damage and effects from attacks done to this Pokemon.'
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '8';
  public name: string = 'Spewpa';
  public fullName: string = 'Spewpa M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      state = store.prompt(state, new CoinFlipPrompt(
        player.id,
        GameMessage.COIN_FLIP
      ), result => {
        if (result) {
          PREVENT_DAMAGE(store, state, effect, this);
        }
      });
    }
    return state;
  }
}
