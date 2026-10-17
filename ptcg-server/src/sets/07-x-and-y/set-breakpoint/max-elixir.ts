import { EnergyType, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { State, StoreLike, TrainerCard, GameError, GameLog, GameMessage, Player, PlayerType, SlotType, StateUtils, CardList, AttachEnergyPrompt } from '../../../game';
import { MOVE_CARDS, SHUFFLE_DECK, SHOW_CARDS_TO_PLAYER } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class MaxElixir extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'BKP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '102';
  public name: string = 'Max Elixir';
  public fullName: string = 'Max Elixir BKP';
  public text: string =
    'Look at the top 6 cards of your deck and attach a basic Energy card you find there to a Basic Pokémon on your Bench. Shuffle the other cards back into your deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return player.deck.cards.length > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      const temp = new CardList();

      MOVE_CARDS(store, state, player.deck, temp, { count: 6, sourceCard: this });
      SHOW_CARDS_TO_PLAYER(store, state, player, temp.cards);

      return store.prompt(
        state,
        new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_CARDS,
          temp, // Only show drawn energies
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
          { min: 0, max: 1 },
        ),
        (transfers) => {
          // Attach energy based on prompt selection
          if (transfers) {
            for (const transfer of transfers) {
              const target = StateUtils.getTarget(state, player, transfer.to);
              MOVE_CARDS(store, state, temp, target, { cards: [transfer.card], sourceCard: this });

              store.log(state, GameLog.LOG_PLAYER_ATTACHES_CARD, {
                name: player.name,
                card: transfer.card.name,
                pokemon: target.getPokemonCard()!.name,
              });
            }
          }

          temp.moveToTopOfDestination(player.deck);

          return SHUFFLE_DECK(store, state, player);
        },
      );
    }

    return state;
  }
}
