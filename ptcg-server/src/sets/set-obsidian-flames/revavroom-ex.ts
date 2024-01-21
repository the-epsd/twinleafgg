import { PokemonCard, Stage, CardType, PowerType } from '../../game';

export class Revavroomex extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;
  
  public cardType: CardType = CardType.METAL;
  
  public hp: number = 280;
  
  public weakness = [{ type: CardType.FIRE }];
  
  public retreat = [ CardType.COLORLESS ];
  
  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public powers = [
    {
      name: 'Tune-Up',
      powerType: PowerType.ABILITY,
      text: 'This Pokémon may have up to 4 Pokémon Tools attached to it. If it loses this Ability, discard Pokémon Tools from it until only 1 remains.'

    }
  ];
  
  public attacks = [
    {
      name: 'Wild Drift',
      cost: [CardType.METAL, CardType.METAL, CardType.COLORLESS],
      damage: 170,
      text: 'During your opponent\'s next turn, this Pokémon takes 30 less damage from attacks (after applying Weakness and Resistance).'
    }
  ];
  
  public set: string = 'OBF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '156';

  public name: string = 'Revavroom ex';

  public fullName: string = 'Revavroom ex OBF';
  
}