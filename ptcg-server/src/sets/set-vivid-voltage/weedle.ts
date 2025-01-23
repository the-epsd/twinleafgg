import { Card, CardType, ChooseCardsPrompt, GameMessage, PokemonCard, ShowCardsPrompt, ShuffleDeckPrompt, Stage, State, StoreLike, SuperType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

function* useBugHunch(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = effect.opponent;

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    { superType: SuperType.POKEMON, stage: Stage.BASIC, cardType: CardType.GRASS },
    { min: 0, max: 2, allowCancel: true }
  ), selected => {
    cards = selected || [];
    next();
  });

  player.deck.moveCardsTo(cards, player.hand);

  if (cards.length > 0) {
    yield store.prompt(state, new ShowCardsPrompt(
      opponent.id,
      GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
      cards
    ), () => next());
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class WeedleVIV extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 40;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public set = 'VIV';

  public setNumber = '1';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'D';

  public name = 'Weedle';

  public fullName = 'Weedle VIV';

  public attacks = [
    {
      name: 'Bug Hunch',
      cost: [CardType.GRASS],
      damage: 0,
      text: 'Search your deck for up to 2 G Pokemon, reveal them, and put them into your hand. Then, shuffle your deck.'
    },
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Bug Hunch
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useBugHunch(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}