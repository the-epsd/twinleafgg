import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { GameMessage, StateUtils } from '../../game';

export class Jynx extends PokemonCard {

  public name = 'Jynx';
  
  public set = 'BS';
  
  public fullName = 'Jynx BS';

  public stage = Stage.BASIC;

  public cardType = CardType.PSYCHIC;

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '31';

  public hp = 70;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Doubleslap',
      cost: [CardType.PSYCHIC],
      damage: 10,
      text: 'Flip 2 coins. This attack does 10 damage times the number of heads.'
    },
    {
      name: 'Meditate',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS],
      damage: 20,
      text: 'Does 20 damage plus 10 more damage for each damage counter on the Defending Pokémon.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return store.prompt(state, [
        new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP), 
        new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP)
      ], (results) => {
        const heads = results.filter(r => r).length;
        effect.damage = heads * 10;
      });
    }
    
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const damage = opponent.active.damage + 20;
      effect.damage = damage;
    }
    
    return state;
  }
}
