import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { Card } from '../../game/store/card/card';
import { CardList } from '../../game/store/state/card-list';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';

function* useSmoothOver(next: Function, store: StoreLike, state: State,
  self: Magcargo, effect: PowerEffect): IterableIterator<State> {
  const player = effect.player;
  let cards: Card[] = [];

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

  const deckTop = new CardList();

  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    {},
    { min: 1, max: 1, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  player.deck.moveCardsTo(cards, deckTop);

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
    if (order === null) {
      return state;
    }
    deckTop.applyOrder(order);
    deckTop.moveToTopOfDestination(player.deck);
  });
}

export class Magcargo extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Slugma';
  public cardType: CardType = CardType.FIRE;
  public hp: number = 90;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  public powers = [{
    name: 'Smooth Over',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may discard a Fire Energy card attached to this Pokémon. If you do, this Pokémon gets +20 HP until the end of your turn.'
  }];
  public attacks = [{
    name: 'Combustion',
    cost: [CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS],
    damage: 50,
    text: ''
  }];
  public set: string = 'CES';
  public name: string = 'Magcargo';
  public fullName: string = 'Magcargo CES';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '24';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const generator = useSmoothOver(() => generator.next(), store, state, this, effect);
      return generator.next().value;

    }
    return state;
  }

}