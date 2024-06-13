import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Varoom extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public regulationMark = 'G';
  public cardType: CardType = CardType.METAL;
  public hp: number = 60;
  public weakness = [{ type: CardType.FIRE }];
  public resistance = [{ type: CardType.GRASS, value: -30 }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Spinning Draw',
    cost: [CardType.METAL],
    damage: 10,
    text: 'Draw a card.'
  }];

  public set: string = 'OBF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '154';
  public name: string = 'Varoom';
  public fullName: string = 'Varoom OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      player.deck.moveTo(player.hand, 1);
    }
    return state;
  }
}