import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { PowerType } from '../../game';

export class AntiqueHelixFossil extends PokemonCard {

  public superType = SuperType.TRAINER;

  public regulationMark = 'G';
    
  public stage: Stage = Stage.BASIC;
  
  public cardType: CardType = CardType.COLORLESS;
  
  public hp: number = 60;
  
  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public text = 'Play this card as if it were a 60-HP Basic [C] Pokémon. This card can\'t be affected by any Special Conditions and can\'t retreat.' +

  'At any time during your turn, you may discard this card from play.';

  public powers = [{
    name: 'Helical Swell',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, your opponent can\'t play any Stadium cards from their hand.'
  }];

  public set: string = 'FST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '153';

  public name: string = 'Antique Helix Fossil';

  public fullName: string = 'Antique Helix Fossil MEW';

}