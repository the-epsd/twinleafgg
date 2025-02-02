import { PokemonCard, Stage, CardType, CardTag, CardList, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class PalkiaDialgaLEGEND extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.WATER;
  public cardType2: CardType = CardType.METAL;
  public hp: number = 160;
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  public weakness = [{ type: CardType.LIGHTNING }];
  public resistance: any[] = [];
  public attacks = [
    {
      name: 'Sudden Delete',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      text: 'Choose 1 of your opponent\'s Benched Pokémon. Put that Pokémon and all cards attached to it back into your opponent\'s hand.'
    },
    {
      name: 'Time Control',
      // cost: [CardType.METAL, CardType.METAL, CardType.COLORLESS],
      cost: [],
      damage: 0,
      text: 'Discard all [M] Energy attached to Palkia & Dialga LEGEND. Add the top 2 cards of your opponent\'s deck to his or her Prize cards.'
    }
  ];

  public set: string = 'LEGEND';
  public name: string = 'Palkia & Dialga LEGEND';
  public fullName: string = 'Palkia & Dialga LEGEND LEGEND';
  public tags = [CardTag.LEGEND];
  public setNumber = '1';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const allPrizeCards = new CardList();
      player.prizes.forEach(prizeList => {
        allPrizeCards.cards.push(...prizeList.cards);
      });

      player.deck.cards.slice(0, 2).forEach(card => {
        allPrizeCards.cards.push(card);
      });
      player.deck.cards.splice(0, 2);

      // Redistribute the prize cards
      const prizeCount = allPrizeCards.cards.length;
      player.prizes = [];
      for (let i = 0; i < prizeCount; i++) {
        const newPrizeList = new CardList();
        newPrizeList.cards.push(allPrizeCards.cards[i]);
        player.prizes.push(newPrizeList);
      }

    }
    return state;
  }
}