import { TrainerType } from '../../game/store/card/card-types';
import { PowerType, TrainerCard } from '../../game';

export class ForestSealStone extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '156';

  public regulationMark = 'F';

  public name: string = 'Forest Seal Stone';

  public fullName: string = 'Forest Seal Stone SIT';

  public useWhenAttached = true;

  public powers = [{
    name: 'Forest Seal Stone',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'During your turn, you may search your deck for up to ' +
      '2 cards and put them into your hand. Then, shuffle your ' +
      'deck. (You can\'t use more than 1 VSTAR Power in a game.)'
  }];

}