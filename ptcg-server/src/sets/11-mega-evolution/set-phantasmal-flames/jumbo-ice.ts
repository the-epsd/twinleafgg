import { GameError, GameMessage, Player, State, StoreLike, TrainerCard, TrainerType } from '../../../game';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';

function getProvidedEnergyCount(store: StoreLike, state: State, player: Player): number {
  const checkEnergy = new CheckProvidedEnergyEffect(player, player.active);
  store.reduceEffect(state, checkEnergy);
  return checkEnergy.energyMap.reduce((sum, em) => sum + em.provides.length, 0);
}

export class JumboIce extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark = 'I';
  public set: string = 'PFL';
  public name: string = 'Jumbo Ice Cream';
  public fullName: string = 'Jumbo Ice M2';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '91';
  public text: string = 'Heal 80 damage from your Active Pokémon that has 3 or more Energy attached.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (!player.active.getPokemonCard()) {
      return false;
    }

    if (player.active.damage === 0) {
      return false;
    }

    return getProvidedEnergyCount(store, state, player) >= 3;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      if (!player.active.getPokemonCard() || player.active.damage === 0 || getProvidedEnergyCount(store, state, player) < 3) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const healEffect = new HealEffect(player, player.active, 80);
      store.reduceEffect(state, healEffect);
      MOVE_CARDS(store, state, player.supporter, player.discard, { cards: [this], sourceCard: this });
    }

    return state;
  }
}
