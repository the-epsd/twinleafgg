import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { GameError, GameMessage, StateUtils } from '../../game';
import { ADD_MARKER, HAS_MARKER, PUT_DAMAGE, REMOVE_MARKER } from '../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';

export class BlackBeltsTraining extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'PRE';

  public name: string = 'Black Belt\'s Training';

  public fullName: string = 'Black Belt\'s Training PRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '96';

  public regulationMark = 'H';

  public text: string =
    'During this turn, attacks used by your Pokémon do 40 more damage to your opponent\'s Active Pokémon ex (before applying Weakness and Resistance).';

  private readonly BLACK_BELTS_TRAINING_MARKER = 'BLACK_BELTS_TRAINING_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      supporterTurn == 1;

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      ADD_MARKER(this.BLACK_BELTS_TRAINING_MARKER, player, this);
      player.supporter.moveCardTo(effect.trainerCard, player.discard);
    }

    if (PUT_DAMAGE(effect) && HAS_MARKER(this.BLACK_BELTS_TRAINING_MARKER, effect.player, this) && effect.damage > 0) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const oppActiveCard = effect.target.getPokemonCard();
      if (oppActiveCard && oppActiveCard.tags.includes(CardTag.POKEMON_ex)) {

        if (effect.target !== player.active && effect.target !== opponent.active) {
          return state;
        }

        effect.damage += 40;
      }
    }

    if (effect instanceof EndTurnEffect && HAS_MARKER(this.BLACK_BELTS_TRAINING_MARKER, effect.player, this)) {
      REMOVE_MARKER(this.BLACK_BELTS_TRAINING_MARKER, effect.player, this);
    }
    return state;
  }
}
