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

export class Koffing extends PokemonCard {

  public name = 'Koffing';

  public cardImage: string = 'assets/cardback.png';

  public setNumber = '51';

  public set = 'BS';

  public fullName = 'Koffing BS';

  public stage = Stage.BASIC;

  public cardType = CardType.GRASS;

  public hp = 50;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Foul Gas',
      cost: [CardType.GRASS, CardType.GRASS],
      damage: 10,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned; if tails, it is now Confused.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return store.prompt(state, new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP), (heads) => {
        const condition = heads
          ? new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED])
          : new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
        store.reduceEffect(state, condition);
      });
    }
    return state;
  }

}
