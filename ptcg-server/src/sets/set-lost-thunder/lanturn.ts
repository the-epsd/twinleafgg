import { PokemonCard, TrainerCard } from '../../game';
import { GameLog, GameMessage } from '../../game/game-message';
import { Card } from '../../game/store/card/card';
import { CardType, SpecialCondition, Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

function* useAttack(next: Function, store: StoreLike, state: State, self: Lanturn, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let cards: Card[] = [];

  const itemsInDiscardPile = player.discard.cards.filter(c => c instanceof TrainerCard && c.trainerType == TrainerType.ITEM).length;

  if (itemsInDiscardPile === 0) {
    return state;
  }

  const blocked: number[] = [];
  player.discard.cards.forEach((c, index) => {
    if (c instanceof TrainerCard && c.trainerType == TrainerType.ITEM) {
    } else {
      blocked.push(index);
    }
  });

  const min = Math.min(itemsInDiscardPile, 4);
  const max = Math.min(itemsInDiscardPile, 4);
  
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_DECK,
    player.discard,
    { superType: SuperType.TRAINER, trainerType: TrainerType.ITEM },
    { min, max, allowCancel: false, blocked }
  ), selected => {
    cards = selected || [];
    next();
  });

  player.discard.moveCardsTo(cards, player.deck);

  cards.forEach((card, index) => {
    store.log(state, GameLog.LOG_PLAYER_RETURNS_TO_DECK_FROM_DISCARD, { name: player.name, card: card.name });
  });

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

export class Lanturn extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  
  public evolvesFrom: string = 'Chinchou';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 110;

  public weakness = [{ type: CardType.FIGHTING }];
  
  public resistance = [{ type: CardType.METAL, value: -20 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  
  public attacks = [
    {
      name: 'Salvage',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Shuffle 4 Item cards from your discard pile into your deck.'
    },
    {
      name: 'Signal Beam',
      cost: [CardType.LIGHTNING, CardType.COLORLESS],
      damage: 50,
      text: 'Your opponent\'s Active Pokémon is now Confused.'
    }
  ];

  public set: string = 'SCR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '46';

  public name: string = 'Electabuzz';

  public fullName: string = 'Electabuzz SCR';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useAttack(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }
    
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      store.reduceEffect(state, specialConditionEffect);
      return state;
    }

    return state;
  }

}