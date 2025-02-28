import { Attack, CardType, PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DRAW_CARDS } from '../../game/store/prefabs/prefabs';

export class Blitzle extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks: Attack[] = [
    {
      name: 'Add On',
      cost: [C],
      damage: 0,
      text: 'Draw a card.'
    },
    { name: 'Static Shock', cost: [L, C], damage: 20, text: '' },
  ];

  public set: string = 'SSP';
  public setNumber: string = '62';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Blitzle';
  public fullName: string = 'Blitzle SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack == this.attacks[0])
      DRAW_CARDS(effect.player, 1);
    return state;
  }
}