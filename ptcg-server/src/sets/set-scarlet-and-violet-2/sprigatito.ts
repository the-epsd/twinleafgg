import { Card } from '../../game/store/card/card';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { GameMessage } from '../../game/game-message';

function* useGatherSunlight(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    { superType: SuperType.ENERGY, cardType: CardType.GRASS },
    { min: 1, max: 2, allowCancel: true }
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

export class Sprigatito extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 60;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Gather Sunlight',
      cost: [ CardType.GRASS ],
      damage: 0,
      text: 'Search your deck for up to 2 Basic Energy cards, reveal ' +
      'them, and put them in your hand. Then, shuffle your deck. '
    },
    {
      name: 'Seed Bomb',
      cost: [ CardType.GRASS ],
      damage: 10,
      text: ''
    }
  ];

  public set: string = 'PAL';

  public name: string = 'Sprigatito';

  public fullName: string = 'Sprigatito PAL 12';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const generator = useGatherSunlight(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }

}