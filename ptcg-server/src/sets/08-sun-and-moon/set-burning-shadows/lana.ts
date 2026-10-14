import { TrainerCard } from '../../../game/store/card/trainer-card';
import { CardType, TrainerType } from '../../../game/store/card/card-types';
import { Player, PlayerType, StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Lana extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'BUS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '117';
  public name: string = 'Lana';
  public fullName: string = 'Lana BUS';
  public text: string =
    'Heal 50 damage from each of your Pokémon that has any [W] Energy attached to it. You may play only 1 Supporter card during your turn (before your attack).';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        const checkEnergy = new CheckProvidedEnergyEffect(player, cardList);
        store.reduceEffect(state, checkEnergy);

        const hasWaterEnergy = checkEnergy.energyMap.some((em) =>
          em.provides.includes(CardType.WATER),
        );

        if (hasWaterEnergy && cardList.damage > 0) {
          const healEffect = new HealEffect(player, cardList, 50);
          store.reduceEffect(state, healEffect);
        }
      });
    }

    return state;
  }
}
