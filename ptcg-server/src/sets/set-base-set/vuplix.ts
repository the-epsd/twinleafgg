import { GameMessage } from '../../game';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Attack } from '../../game/store/card/pokemon-types';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Vulpix extends PokemonCard {

  public name = 'Vulpix';

  public cardImage: string = 'assets/cardback.png';

  public setNumber = '68';

  public set = 'BS';

  public fullName = 'Vulpix BS';

  public cardType = CardType.FIRE;

  public stage = Stage.BASIC;

  public evolvesInto = ['Ninetales', 'Ninetales ex', 'Light Ninetales'];

  public hp = 50;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Confuse Ray',
      cost: [CardType.FIRE, CardType.FIRE],
      damage: 10,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
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
