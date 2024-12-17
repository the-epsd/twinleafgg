import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Orthworm extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.METAL;

  public hp: number = 140;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    { name: 'Punch and Draw', cost: [CardType.METAL], damage: 20, text: 'Draw 2 cards.' },
    { name: 'Crunch-Time Rush', cost: [CardType.METAL, CardType.COLORLESS, CardType.COLORLESS], damage: 90, text: 'If there are 3 or fewer cards in your deck, this attack does 150 more damage.' }
  ];

  public set: string = 'PAR';

  public name: string = 'Orthworm';

  public fullName: string = 'Orthworm PAR';

  public setNumber: string = '138';

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Punch and Draw
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      player.deck.moveTo(player.hand, 2);
    }

    // Crunch-Time Rush
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      if (player.deck.cards.length <= 3) { effect.damage += 150; }
    }

    return state;
  }
}