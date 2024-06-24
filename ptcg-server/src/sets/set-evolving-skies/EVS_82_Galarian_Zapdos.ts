import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class GalarianZapdos extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIGHTING;
  public hp: number = 110;
  public weakness = [{ type: CardType.PSYCHIC }];
  public retreat = [];

  

  public set: string = 'EVS';
  public regulationMark: string = 'E';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '82';
  public name: string = 'Galarian Zapdos';
  public fullName: string = 'Galarian Zapdos EVS';
}