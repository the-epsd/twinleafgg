import { TrainerCard } from '../../game/store/card/trainer-card';
import { EnergyType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { GameMessage } from '../../game/game-message';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyPrompt, PlayerType, SlotType, StateUtils } from '../../game';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  let coin1Result = false;
  let coin2Result = false;

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  yield store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), (result: boolean) => {
    coin1Result = result;
    next();
  });
  yield store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), (result: boolean) => {
    coin2Result = result;
    next();
  });
  if (coin1Result && coin2Result) {
    state = store.prompt(state, new AttachEnergyPrompt(
      player.id,
      GameMessage.ATTACH_ENERGY_TO_ACTIVE,
      player.deck,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.BENCH, SlotType.ACTIVE],
      { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
      { allowCancel: false, min: 0, max: 1 }
    ), transfers => {
      transfers = transfers || [];

      if (transfers.length === 0) {
        return;
      }

      for (const transfer of transfers) {
        const target = StateUtils.getTarget(state, player, transfer.to);
        player.deck.moveCardTo(transfer.card, target);
      }

      return store.prompt(state, new ShuffleDeckPrompt(player.id), (order: any[]) => {
        player.deck.applyOrder(order);
      });
    });
    return state;
  }
}

export class EnergyCoin extends TrainerCard {
  public regulationMark = 'I';
  public trainerType = TrainerType.ITEM;
  public set = 'BLK';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '81';
  public name = 'Energy Coin';
  public fullName: string = 'Energy Coin SV11B';
  public text: string = 'Flip 2 coins. If both of them are heads, search your deck for 1 Basic Energy card and attach it to one of your Pokémon. Then shuffle your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}                         