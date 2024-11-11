import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, EnergyCard, ShuffleDeckPrompt, Card } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class VictiniPrismStar extends PokemonCard {

  public tags: string[] = [CardTag.PRISM_STAR];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 90;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Infinity',
      cost: [CardType.FIRE, CardType.FIRE],
      damage: 0,
      text: 'This attack does 20 damage for each basic Energy card in your discard pile. ' +
        'Then, shuffle those cards into your deck.'
    },
  ];

  public set: string = 'DRM';

  public setNumber: string = '7';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Victini Prism Star';

  public fullName: string = 'Victini Prism Star DRM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const shuffleList: Card[] = [];
      player.discard.cards.forEach(c => {
        if ((c instanceof EnergyCard) && (c.energyType == EnergyType.BASIC)) { shuffleList.push(c); }
      });
      effect.damage = 20 * shuffleList.length;
      player.discard.moveCardsTo(shuffleList, player.deck);
      return store.prompt(state, new ShuffleDeckPrompt(player.id), order => { player.deck.applyOrder(order); });
    }



    return state;
  }
}