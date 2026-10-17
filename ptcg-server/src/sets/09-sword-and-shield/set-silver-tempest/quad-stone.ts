import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import {
  TrainerCard,
  StoreLike,
  State,
  SelectOptionPrompt,
  GameMessage,
  Player,
  PlayerType,
} from '../../../game';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class QuadStone extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark: string = 'F';
  public set: string = 'SIT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '163';
  public name: string = 'Quad Stone';
  public fullName: string = 'Quad Stone SIT 163';
  public text: string =
    'You may use 4 Quad Stone cards at once.\n• If you used 1 card, heal 10 damage from your Active Pokémon.\n• If you used 4 cards, heal all damage from each of your Pokémon. (This effect works one time for 4 cards.) You may play any number of Item cards during your turn.';

  public canPlay(_store: StoreLike, _state: State, _player: Player): boolean {
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      // Count additional Quad Stone cards in hand (this card is already in supporter pile)
      const quadStonesInHand = player.hand.cards.filter((c) => c.name === 'Quad Stone');
      const canPlayFour = quadStonesInHand.length >= 3;

      if (!canPlayFour) {
        // Only 1 card: heal 10 damage from Active Pokemon
        const healEffect = new HealEffect(player, player.active, 10);
        store.reduceEffect(state, healEffect);

        return state;
      }

      // Player has 3 more, ask if they want to play 4 at once
      return store.prompt(
        state,
        new SelectOptionPrompt(
          player.id,
          GameMessage.CHOOSE_OPTION,
          [
            'Play 1 card: Heal 10 damage from your Active Pokémon.',
            'Play 4 cards: Heal all damage from each of your Pokémon.',
          ],
          { allowCancel: false, defaultValue: 0 },
        ),
        (choice) => {
          if (choice === 0) {
            // Use 1 card: heal 10 from active
            const healEffect = new HealEffect(player, player.active, 10);
            store.reduceEffect(state, healEffect);
          } else {
            // Use 4 cards: discard 3 more Quad Stone from hand, heal all damage from each Pokemon
            const extraQuadStones = player.hand.cards
              .filter((c) => c.name === 'Quad Stone')
              .slice(0, 3);
            extraQuadStones.forEach((card) => {
              MOVE_CARDS(store, state, player.hand, player.discard, {
                cards: [card],
                sourceCard: this,
              });
            });

            // Heal all damage from each of player's Pokemon
            player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
              if (cardList.damage > 0) {
                const healEffect = new HealEffect(player, cardList, cardList.damage);
                store.reduceEffect(state, healEffect);
              }
            });
          }
        },
      );
    }

    return state;
  }
}
