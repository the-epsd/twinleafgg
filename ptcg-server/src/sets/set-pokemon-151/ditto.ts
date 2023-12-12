import { PokemonCard } from '../../game/store/card/pokemon-card'; 
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';

export class Ditto extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;  

  public hp: number = 60;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Transformative Start',
    powerType: PowerType.ABILITY, 
    useWhenInPlay: true,
    text: 'Once during your first turn, if this Pokémon is in the Active Spot, you may search your deck and choose a Basic Pokémon you find there, except any Ditto. If you do, discard this Pokémon and all attached cards, and put the chosen Pokémon in its place. Then, shuffle your deck.'
  }];

  public attacks = [{
    name: 'Splup',
    cost: [CardType.COLORLESS],
    damage: 10,
    text: ''
  }];

  public set: string = '151';

  public set2: string = '151';

  public setNumber: string = '132';

  public name: string = 'Ditto';

  public fullName: string = 'Ditto MEW';

}