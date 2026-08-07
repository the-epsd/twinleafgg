import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';

export class TeamAquasSpheal extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.TEAM_AQUA];
  public hp: number = 60;
  public cardType: CardType = W;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Water Gun',
    cost: [W],
    damage: 10,
    text: ''
  }];

  public set: string = 'DCR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '3';
  public name: string = 'Team Aqua\'s Spheal';
  public fullName: string = 'Team Aqua\'s Spheal DCR';
}
