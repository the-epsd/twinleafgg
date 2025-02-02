import { GameMessage } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Attack } from '../../game/store/card/pokemon-types';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Pikachu extends PokemonCard {

  public name = 'Pikachu';

  public cardImage: string = 'assets/cardback.png';

  public set = 'BS';

  public setNumber = '58';

  public cardType = CardType.LIGHTNING;

  public fullName = 'Pikachu BS';

  public stage = Stage.BASIC;

  public evolvesInto = ['Raichu', 'Alolan Raichu', 'Raichu-GX', 'Dark Raichu', 'Raichu ex'];

  public hp = 40;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Gnaw',
      cost: [CardType.COLORLESS],
      damage: 10,
      text: ''
    },
    {
      name: 'Thunder Jolt',
      cost: [CardType.LIGHTNING, CardType.COLORLESS],
      damage: 30,
      text: 'Flip a coin. If tails, Pikachu does 10 damage to itself.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return store.prompt(state, new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP), (heads) => {
        if (!heads) {
          const damage = new DealDamageEffect(effect, 10);
          damage.target = effect.player.active;
          store.reduceEffect(state, damage);
        }
      });
    }
    return state;
  }

}
