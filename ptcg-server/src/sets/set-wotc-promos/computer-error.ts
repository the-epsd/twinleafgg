import { StoreLike, State, GameMessage, StateUtils, SelectPrompt } from '../../game';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';

export class ComputerError extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public tags = [CardTag.ROCKETS_SECRET_MACHINE];
  public set: string = 'PR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '16';
  public name: string = 'Computer Error';
  public fullName: string = 'Computer Error PR';

  public text = 'You may draw up to 5 cards, then your opponent may draw up to 5 cards. Your turn is over now (you don\'t get to attack).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      player.hand.moveCardTo(effect.trainerCard, player.supporter);

      const maxPlayerDraw = 5;

      const options: { message: string, value: number }[] = [];
      for (let i = maxPlayerDraw; i >= 0; i--) {
        options.push({ message: `Draw ${i} card(s)`, value: i });
      }

      store.prompt(state, new SelectPrompt(
        player.id,
        GameMessage.WANT_TO_DRAW_CARDS,
        options.map(c => c.message),
        { allowCancel: false }
      ), choice => {
        const numCardsToDraw = options[choice].value;
        player.deck.moveTo(player.hand, numCardsToDraw);

        const opponentOptions: { message: string, value: number }[] = [];
        for (let i = maxPlayerDraw; i >= 0; i--) {
          opponentOptions.push({ message: `Draw ${i} card(s)`, value: i });
        }

        store.prompt(state, new SelectPrompt(
          opponent.id,
          GameMessage.WANT_TO_DRAW_CARDS,
          opponentOptions.map(c => c.message),
          { allowCancel: false }
        ), opponentChoice => {
          const opponentNumCardsToDraw = opponentOptions[opponentChoice].value;
          opponent.deck.moveTo(opponent.hand, opponentNumCardsToDraw);
        });
      });

      player.supporter.moveCardTo(effect.trainerCard, player.discard);

      // Pretty much just for Chaos Gym: if used while not your turn, there is no end turn effect
      // Better to refer to whoever's turn it is, but idk how to do that
      if (effect.player === StateUtils.findOwner(state, StateUtils.findCardList(state, this))) {
        const endTurnEffect = new EndTurnEffect(player);
        store.reduceEffect(state, endTurnEffect);
      }
    }

    return state;
  }
}