import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Excadrill extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Drilbur';

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 140;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    { name: 'Eleventh Hour Tackle', cost: [CardType.FIGHTING], damage: 30, text: 'If there are 3 or fewer cards in your deck, this attack does 150 more damage.' },
    { name: 'Drill Bazooka', cost: [CardType.FIGHTING], damage: 120, text: 'Discard the top 4 cards of your deck.' }
  ];

  public set: string = 'CEC';

  public name: string = 'Excadrill';

  public fullName: string = 'Excadrill CEC';

  public setNumber: string = '115';

  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Eleventh Hour Tackle
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      if (player.deck.cards.length <= 3) { effect.damage += 150; }
    }

    // Drill Bazooka
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      player.deck.moveTo(player.discard, 4);
    }

    return state;
  }
}