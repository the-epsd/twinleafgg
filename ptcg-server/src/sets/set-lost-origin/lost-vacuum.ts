import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
export class LostVacuum extends TrainerCard {
  
  public trainerType: TrainerType = TrainerType.ITEM;

  public regulationMark = 'F';

  public set: string = 'LOR';

  public set2: string = 'astralradiance';

  public setNumber: string = '141';

  public name: string = 'Lost Vacuum';

  public fullName: string = 'Lost Vacuum LOR';
  
  public text = 
    '';

}

//   public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

//     if (effect instanceof TrainerEffect && effect.trainerCard === this) {
//       const player = effect.player;

//       const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
//       state = store.reduceEffect(state, checkProvidedEnergy);

//       return store.prompt(state, new SelectPrompt(
//         player.id,
//         GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
//         [ GameMessage.ALL_FIRE_ENERGIES, GameMessage.ALL_LIGHTNING_ENERGIES ],
//         { allowCancel: false }
//       ), choice => {
//         const trainerType = choice === 0 ? TrainerType.STADIUM : TrainerType.TOOL;
