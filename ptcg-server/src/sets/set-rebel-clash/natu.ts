import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Natu extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public regulationMark = 'D';
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 60;
  public weakness = [{ type: CardType.DARK }];
  public resistance = [{ type: CardType.FIGHTING, value: -30 }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Me First',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Draw a card.'
  }];

  public set: string = 'RCL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '76';
  public name: string = 'Natu';
  public fullName: string = 'Natu RCL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        return state;
      }

      player.deck.moveTo(player.hand, 1);
      return state;
    }

    return state;
  }
}