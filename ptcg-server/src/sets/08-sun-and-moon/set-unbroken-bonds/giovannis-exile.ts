import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import { StoreLike, State, Player, GameMessage, ChoosePokemonPrompt, PlayerType, SlotType, GameError, CardTarget } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_POKEMON_OFF_BOARD } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class GiovannisExile extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'UNB';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '174';
  public name: string = "Giovanni's Exile";
  public fullName: string = "Giovanni's Exile UNB";
  public text: string =
    'Discard up to 2 of your Benched Pokémon that have no damage counters on them and all cards attached to them. You may play only 1 Supporter card during your turn (before your attack).';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    // Need at least one Benched Pokémon with no damage counters
    if (!player.bench.some((b) => b.cards.length > 0 && b.damage === 0)) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      // Check if there are benched Pokemon with no damage
      if (!player.bench.some((b) => b.cards.length > 0 && b.damage === 0)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Block benched Pokemon that have damage counters
      const blocked: CardTarget[] = [];
      player.bench.forEach((b, index) => {
        if (b.cards.length === 0 || b.damage > 0) {
          blocked.push({ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index });
        }
      });

      store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { min: 1, max: 2, allowCancel: false, blocked },
        ),
        (selected) => {
          if (selected && selected.length > 0) {
            selected.forEach((target) => {
              MOVE_POKEMON_OFF_BOARD(store, state, target, {
                pokemonDestination: player.discard,
                sourceCard: this,
              });
            });
          }
        },
      );
    }

    return state;
  }
}
