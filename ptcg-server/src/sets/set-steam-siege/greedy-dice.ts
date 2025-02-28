import { GameError } from '../../game';
import { GameMessage } from '../../game/game-message';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { DrawPrizesEffect } from '../../game/store/effects/game-effects';
import { CoinFlipEffect, TrainerEffect } from '../../game/store/effects/play-card-effects';
import { CONFIRMATION_PROMPT, SIMULATE_COIN_FLIP, TAKE_SPECIFIC_PRIZES, TAKE_X_PRIZES } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class GreedyDice extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'STS';

  public setNumber: string = '102';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Greedy Dice';

  public fullName: string = 'Greedy Dice STS';

  public text: string =
    'You can play this card only if you took it as a face-down Prize card, before you put it into your hand.' +
    `
    ` +
    'Flip a coin. If heads, take 1 more Prize card.';

  public cardUsed = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    }

    if (effect instanceof DrawPrizesEffect) {
      const generator = this.handlePrizeEffect(
        () => generator.next(),
        store,
        state,
        effect
      );
      return generator.next().value;
    }
    return state;
  }

  private *handlePrizeEffect(next: Function, store: StoreLike, state: State, effect: DrawPrizesEffect): IterableIterator<State> {
    const player = effect.player;
    const prizeCard = effect.prizes.find(cardList => cardList.cards.includes(this));

    // Check if play conditions are met
    if (!prizeCard || !prizeCard.isSecret || effect.destination !== player.hand) {
      return state;
    }

    // Prevent unintended multiple uses
    if (this.cardUsed) {
      return state;
    }

    // Prevent prize card from going to hand until we complete the card effect flow
    effect.preventDefault = true;

    // Ask player if they want to use the card
    let wantToUse = false;
    yield CONFIRMATION_PROMPT(store, state, player, result => {
      wantToUse = result;
      next();
    }, GameMessage.WANT_TO_USE_ITEM_FROM_PRIZES);

    // If the player declines, move the original prize card to hand
    const prizeIndex = player.prizes.findIndex(prize => prize.cards.includes(this));
    const fallback: (prizeIndex: number) => void = (prizeIndex) => {
      if (prizeIndex !== -1) {
        TAKE_SPECIFIC_PRIZES(store, state, player, [player.prizes[prizeIndex]], { skipReduce: true });
      }
      return;
    };

    if (!wantToUse) {
      effect.preventDefault = false;
      fallback(prizeIndex);
      return state;
    }

    // Now that we've confirmed the card can be played, we can update the state
    // (per wording of the card, this still counts as a prize taken even if
    // it does not go to the player's hand)
    this.cardUsed = true;
    player.prizesTaken += 1;

    // If the player agrees, discard Greedy Dice
    for (const [index, prize] of player.prizes.entries()) {
      if (prize.cards.includes(this)) {
        player.prizes[index].moveTo(player.discard);
        break;
      }
    }

    // Handle coin flip
    try {
      const coinFlip = new CoinFlipEffect(player);
      store.reduceEffect(state, coinFlip);
    } catch {
      return state;
    }

    const coinResult = SIMULATE_COIN_FLIP(store, state, player);

    if (!coinResult) {
      return state;
    }

    player.supporter.moveCardTo(this, player.discard);

    // Handle extra prize (excluding the group this card is in)
    yield TAKE_X_PRIZES(store, state, player, 1, {
      promptOptions: {
        blocked: effect.prizes.map(p => player.prizes.indexOf(p))
      }
    }, () => next());

    return state;
  }

}
