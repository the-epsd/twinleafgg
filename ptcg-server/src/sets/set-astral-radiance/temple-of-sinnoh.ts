import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';

export class TempleofSinnoh extends TrainerCard {

  public regulationMark = 'F';

  public set2: string = 'astralradiance';

  public setNumber: string = '155';
  
  public trainerType = TrainerType.STADIUM;

  public set = 'ASR';

  public name = 'Temple of Sinnoh';

  public fullName = 'All Special Energy attached to Pokémon (both yours and your opponent\'s) provide C Energy and have no other effect.';

}