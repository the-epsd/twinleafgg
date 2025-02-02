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

export class Dewgong extends PokemonCard {

  public name = 'Dewgong';
  
  public set = 'BS';
  
  public fullName = 'Dewgong BS';

  public cardType: CardType = CardType.WATER;
  
  public stage = Stage.STAGE_1;
  
  public evolvesFrom = 'Seel';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '25';

  public hp = 80;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Aurora Beam',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: 50,
      text: ''
    },
    {
      name: 'Ice Beam', 
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
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
