import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';

export class TeamRocketsNidoranMale extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType = D;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [ C ];

  public attacks = [
    {
      name: 'Pierce',
      cost: [D],
      damage: 10,
      text: ''
    },
    {
      name: 'Hammer In',
      cost: [D, D],
      damage: 30,
      text: ''
    }
  ];

  public regulationMark = 'I';
  public set: string = 'SV10';
  public setNumber: string = '61';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Team Rocket\'s Nidoran M';
  public fullName: string = 'Team Rocket\'s Nidoran M SV10';
}
