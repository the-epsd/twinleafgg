import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Machoke extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Machop';
  public cardType: CardType = CardType.FIGHTING;
  public hp: number = 100;
  public weakness = [{ type: CardType.PSYCHIC }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Mountain RAMMING',
      cost: [CardType.FIGHTING, CardType.FIGHTING],
      damage: 50,
      text: 'Discard the top card of your opponent\'s deck.'
    }
  ];

  public regulationMark: string = 'G';
  public set: string = 'MEW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '67';
  public name: string = 'Machoke';
  public fullName: string = 'Machoke MEW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (opponent.deck.cards.length > 0) {
        MOVE_CARDS(store, state, opponent.deck, opponent.discard, { count: 1, sourceCard: this, sourceEffect: this.attacks[0] });
      }
    }
    return state;
  }
}
