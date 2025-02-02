import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Shuppet extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 60;
  public weakness = [{ type: CardType.DARK }];
  public resistance = [{ type: CardType.FIGHTING, value: -30 }];
  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    { name: 'Spooky Shot', cost: [CardType.PSYCHIC], damage: 20, text: '' }
  ];

  public set: string = 'SV9';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '35';

  public name: string = 'Shuppet';
  public fullName: string = 'Shuppet SV9';
  
}