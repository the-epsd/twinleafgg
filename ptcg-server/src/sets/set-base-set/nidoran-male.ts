import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';

import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { GameMessage } from '../../game';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class NidoranMale extends PokemonCard {

  public name = 'Nidoran M';

  public cardImage: string = 'assets/cardback.png';

  public set = 'BS';

  public setNumber = '55';

  public fullName = 'Nidoran M BS';

  public cardType = CardType.GRASS;

  public stage = Stage.BASIC;

  public hp = 40;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Horn Hazard',
      cost: [CardType.GRASS],
      damage: 30,
      text: 'Flip a coin. If tails, this attack does nothing.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return store.prompt(state, new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP), (heads) => {
        if (!heads) {
          effect.damage = 0;
        }
      });
    }
    return state;
  }

}
