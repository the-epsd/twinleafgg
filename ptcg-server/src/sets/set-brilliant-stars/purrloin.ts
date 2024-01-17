import { PokemonCard, Stage, CardType, StoreLike, State, CoinFlipPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Purrloin extends PokemonCard {

  public stage = Stage.BASIC;
  
  public cardType = CardType.DARK; 

  public hp = 60;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Surprise Attack',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 30,
    text: 'Flip a coin. If tails, this attack does nothing.'
  }];

  public set: string = 'BRS';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '90';

  public name: string = 'Purrloin';

  public fullName: string = 'Purrloin BRS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
    
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === false) {
          effect.damage = 0;
        }
      });
    }
    return state;
  }
}
