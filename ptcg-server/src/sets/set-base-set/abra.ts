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

export class Abra extends PokemonCard {

  public name = 'Abra';

  public cardImage: string = 'assets/cardback.png';

  public set = 'BS';

  public fullName = 'Abra BS';

  public cardType = CardType.PSYCHIC;

  public setNumber = '43';

  public stage = Stage.BASIC;

  public hp = 30;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [];

  public attacks: Attack[] = [
    {
      name: 'Psyshock',
      cost: [CardType.PSYCHIC],
      damage: 10,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return store.prompt(state, new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP), (heads) => {
        if (heads) {
          const condition = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, condition);
        }
      });
    }
    return state;
  }

}
