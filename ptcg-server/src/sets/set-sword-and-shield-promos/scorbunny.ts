import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';

export class Scorbunny extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIRE;
  public hp: number = 60;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Me First',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Draw a card.'
  },
  {
    name: 'Live Coal',
    cost: [CardType.FIRE, CardType.FIRE],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'D';
  public set = 'SSP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '71';
  public name = 'Scorbunny';
  public fullName = 'Scorbunny SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        return state;
      }

      player.deck.moveTo(player.hand, 1);
    }

    return state;
  }
}