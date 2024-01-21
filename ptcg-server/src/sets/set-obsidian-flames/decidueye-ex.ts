import { PokemonCard, CardType, Stage, PowerType } from '../../game';

export class Decidueyeex extends PokemonCard {

  public cardType: CardType = CardType.GRASS;

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Dartrix';

  public hp: number = 320;

  public weakness = [{ type: CardType.FIRE }];
    
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  
  public powers = [
    {
      name: 'Total Freedom',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text: 'Once during your turn, you may use this Ability. If this Pokémon is on the Bench, switch it with your Active Pokémon. Or, if this Pokémon is in the Active Spot, switch it with 1 of your Benched Pokémon.'
    }
  ];
  
  public attacks = [
    {
      name: 'Hunting Arrow',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: 130,
      text: 'This attack also does 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];
  
  public set: string = 'SET';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '16';

  public name: string = 'Decidueye rc';

  public fullName: string = 'Decidueye ex OBF';

}