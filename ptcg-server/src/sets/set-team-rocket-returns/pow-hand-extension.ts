import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, GameMessage, SelectPrompt, AttachEnergyPrompt, PlayerType, SlotType, ChoosePokemonPrompt } from '../../game';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class PowHandExtension extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'TRR';
  public name: string = 'Pow! Hand Extension';
  public fullName: string = 'Pow! Hand Extension TRR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '85';
  public text = 'You may use this card only if you have more Prize cards left than your opponent. Move 1 Energy card attached to the Defending Pokémon to another of your opponent\'s Pokémon. Or, switch 1 of your opponent\'s Benched Pokémon with 1 of the Defending Pokémon.Your opponent chooses the Defending Pokémon to switch.'

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.getPrizeLeft() < opponent.getPrizeLeft()) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const options: { message: GameMessage, action: () => void }[] = [
        {
          message: GameMessage.MOVE_ENERGY_CARDS,
          action: () => {
            const hasBench = opponent.bench.some(b => b.cards.length > 0);

            if (hasBench === false) {
              return state;
            }

            return store.prompt(state, new AttachEnergyPrompt(
              player.id,
              GameMessage.ATTACH_ENERGY_TO_BENCH,
              opponent.active,
              PlayerType.TOP_PLAYER,
              [SlotType.BENCH],
              { superType: SuperType.ENERGY },
              { allowCancel: false, min: 0, max: 1 }
            ), transfers => {
              transfers = transfers || [];
              for (const transfer of transfers) {
                const target = StateUtils.getTarget(state, opponent, transfer.to);
                opponent.active.moveCardTo(transfer.card, target);
              }
            });
          }
        },
        {
          message: GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          action: () => {
            return store.prompt(state, new ChoosePokemonPrompt(
              opponent.id,
              GameMessage.CHOOSE_POKEMON_TO_SWITCH,
              PlayerType.BOTTOM_PLAYER,
              [SlotType.BENCH],
              { allowCancel: false }
            ), targets => {
              if (targets && targets.length > 0) {
                opponent.active.clearEffects();
                opponent.switchPokemon(targets[0]);
                return state;
              }
            });
          }
        }
      ];


      return store.prompt(state, new SelectPrompt(
        player.id,
        GameMessage.CHOOSE_OPTION,
        options.map(opt => opt.message),
        { allowCancel: false }
      ), choice => {
        const option = options[choice];
        option.action();
      });
    }

    return state;
  }
}