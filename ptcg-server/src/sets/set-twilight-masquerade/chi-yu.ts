import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import {
  StoreLike, State,
  StateUtils
} from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

export class ChiYu extends PokemonCard {

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 110;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Allure',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Draw 2 cards.'
    },
    {
      name: 'Ground Melter',
      cost: [CardType.FIRE, CardType.COLORLESS],
      damage: 60,
      damageCalculation: '+',
      text: 'If a Stadium is in play, this attack does 60 more damage. Then, discard that Stadium.'
    }
  ];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '39';

  public name: string = 'Chi-Yu';

  public fullName: string = 'Chi-Yu TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      player.deck.moveTo(player.hand, 2);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const stadiumCard = StateUtils.getStadiumCard(state);
      if (stadiumCard !== undefined) {

        effect.damage += 60;

        // Discard Stadium
        const cardList = StateUtils.findCardList(state, stadiumCard);
        const player = StateUtils.findOwner(state, cardList);
        cardList.moveTo(player.discard);
        return state;
      }
    }
    return state;
  }
}