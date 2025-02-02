import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { GameMessage } from '../../game';

export class Drowzee extends PokemonCard {

  public name = 'Drowzee';

  public cardImage: string = 'assets/cardback.png';

  public set = 'BS';

  public fullName = 'Drowzee BS';

  public setNumber = '49';

  public cardType = CardType.PSYCHIC;

  public stage = Stage.BASIC;

  public hp = 50;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Pound',
      cost: [CardType.COLORLESS],
      damage: 10,
      text: ''
    },
    {
      name: 'Confuse Ray',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC],
      damage: 10,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return store.prompt(state, new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP), (heads) => {
        if (heads) {
          const condition = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
          store.reduceEffect(state, condition);
        }
      });
    }
    return state;
  }

}
