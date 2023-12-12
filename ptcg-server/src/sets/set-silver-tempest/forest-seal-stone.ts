import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';

export class ForestSealStone extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'SIT';

  public set2: string = 'silvertempest';

  public setNumber: string = '156';

  public regulationMark = 'F';

  public name: string = 'Forest Seal Stone';

  public fullName: string = 'Forest Seal Stone SIT';

  public readonly VSTAR_MARKER = 'VSTAR_MARKER';

}