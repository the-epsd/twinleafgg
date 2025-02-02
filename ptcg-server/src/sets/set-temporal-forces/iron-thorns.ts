import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, CardList, ShuffleDeckPrompt, GameMessage, ShowCardsPrompt, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class IronThorns extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.FUTURE];

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 140;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Destructo-Press',
      cost: [CardType.LIGHTNING, CardType.COLORLESS],
      damage: 70,
      damageCalculation: 'x',
      text: 'Reveal the top 5 cards of your deck. This attack does 70 damage times for each Future card you find there. Then, discard the revealed Future cards and shuffle the other cards back into your deck.'
    },
    {
      name: 'Megaton Lariat',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: 140,
      text: 'If your opponent\'s Active Pokémon is a Pokémon ex or Pokémon V, this attack does 80 more damage.'
    }
  ];

  public set: string = 'TEF';

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '62';

  public name: string = 'Iron Thorns';

  public fullName: string = 'Iron Thorns TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const deckTop = new CardList();
      player.deck.moveTo(deckTop, 5);

      // Filter for item cards
      const futureCards = deckTop.cards.filter(c =>
        c instanceof PokemonCard &&
        c.tags.includes(CardTag.FUTURE)
      );

      if (futureCards.length > 0) {
        state = store.prompt(state, new ShowCardsPrompt(
          opponent.id,
          GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
          futureCards), () => state);
      }

      if (futureCards.length > 0) {
        state = store.prompt(state, new ShowCardsPrompt(
          player.id,
          GameMessage.CARDS_SHOWED_BY_EFFECT,
          futureCards), () => state);
      }

      // Move item cards to hand
      deckTop.moveCardsTo(futureCards, player.discard);

      // Move all cards to discard
      deckTop.moveTo(player.deck, deckTop.cards.length);

      effect.damage = 70 * futureCards.length;

      return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);

        return state;
      });
    }
    return state;
  }
}