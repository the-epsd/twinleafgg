import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Card, GameMessage, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { COPY_OPPONENT_ACTIVE_ATTACK, MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

function* useNastyPlot(next: Function, store: StoreLike, state: State,
  effect: AttackEffect, self: Card): IterableIterator<State> {
  const player = effect.player;

  if (player.deck.cards.length === 0) {
    return state;
  }

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    {},
    { min: 1, max: 1, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  state = MOVE_CARDS(store, state, player.deck, player.hand, { cards, sourceCard: self, sourceEffect: self.attacks[0] });

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Zoroark extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Zorua';
  public cardType: CardType = D;
  public hp: number = 100;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Nasty Plot',
    cost: [D],
    damage: 0,
    text: 'Search your deck for a card and put it into your hand. ' +
      'Shuffle your deck afterward.'
  }, {
    name: 'Foul Play',
    cost: [C, C],
    damage: 0,
    copycatAttack: true,
    text: 'Choose 1 of the Defending Pokemon\'s attacks and use it ' +
      'as this attack.'
  }];

  public set: string = 'BLW';
  public setNumber: string = '71';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Zoroark';
  public fullName: string = 'Zoroark BLW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const generator = useNastyPlot(() => generator.next(), store, state, effect as AttackEffect, this);
      return generator.next().value;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      return COPY_OPPONENT_ACTIVE_ATTACK(store, state, effect as AttackEffect);
    }

    return state;
  }

}
