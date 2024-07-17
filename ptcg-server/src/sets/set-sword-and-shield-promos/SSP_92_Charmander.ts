import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Charmander extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIRE;
  public hp: number = 70;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Collect',
    cost: [CardType.FIRE],
    damage: 0,
    text: 'Draw a card.'
  },
  {
    name: 'Flare',
    cost: [CardType.FIRE, CardType.FIRE],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'D';
  public set = 'SSP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '92';
  public name = 'Charmander';
  public fullName = 'Charmander SSP';

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