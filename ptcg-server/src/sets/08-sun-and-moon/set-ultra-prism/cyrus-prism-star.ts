import { Effect } from '../../../game/store/effects/effect';
import { CheckPokemonTypeEffect } from '../../../game/store/effects/check-effects';
import { CardTag, CardType, TrainerType } from '../../../game/store/card/card-types';
import {
  ChoosePokemonPrompt,
  GameError,
  GameMessage,
  Player,
  PlayerType,
  SlotType,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
} from '../../../game';
import { MOVE_CARDS, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class CyrusPrismStar extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  protected _tags = [CardTag.PRISM_STAR];
  public set: string = 'UPR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '120';
  public name: string = 'Cyrus Prism Star';
  public fullName: string = 'Cyrus Prism Star UPR';
  public text: string =
    'You can play this card only if your Active Pokémon is a [W] or [M] Pokémon.\n\n' +
    'Your opponent chooses 2 Benched Pokémon and shuffles the others, and all cards attached to them, into their deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }

    const checkPokemonTypeEffect = new CheckPokemonTypeEffect(player.active);
    store.reduceEffect(state, checkPokemonTypeEffect);
    return (
      checkPokemonTypeEffect.cardTypes.includes(CardType.WATER) ||
      checkPokemonTypeEffect.cardTypes.includes(CardType.METAL)
    );
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      if (!this.canPlay(store, state, player)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const opponentBenched = opponent.bench.filter((c) => c.cards.length > 0);
      if (opponentBenched.length > 2) {
        store.prompt(
          state,
          new ChoosePokemonPrompt(
            opponent.id,
            GameMessage.CHOOSE_CARDS,
            PlayerType.BOTTOM_PLAYER,
            [SlotType.BENCH],
            { allowCancel: false, min: Math.min(opponentBenched.length, 2), max: 2 },
          ),
          (targets) => {
            if (!targets || targets.length === 0) {
              return;
            }

            let shuffled = false;
            opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (card) => {
              if (card !== opponent.active && !targets.includes(card)) {
                card.clearEffects();
                MOVE_CARDS(store, state, card, opponent.deck);
                shuffled = true;
              }
            });

            if (shuffled) {
              SHUFFLE_DECK(store, state, opponent);
            }
          },
        );
      }
    }

    return state;
  }
}
