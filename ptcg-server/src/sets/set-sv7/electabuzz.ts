import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Electabuzz extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = L;

  public hp: number = 90;

  public weakness = [{ type: F }];

  public retreat = [C, C];

  public attacks = [
    {
      name: 'Collect',
      cost: [L],
      damage: 0,
      text: 'Draw a card.'
    },
    {
      name: 'Magnum Punch',
      cost: [L, L],
      damage: 40,
      text: ''
    }
  ];

  public set: string = 'SCR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '46';

  public name: string = 'Electabuzz';

  public fullName: string = 'Electabuzz SCR';

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
