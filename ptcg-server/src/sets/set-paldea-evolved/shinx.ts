import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType } from '../../game';

export class Shinx extends PokemonCard {

  public stage = Stage.BASIC;
  
  public cardType = CardType.LIGHTNING;
  
  public hp = 40;

  public weakness = [{ type: CardType.FIGHTING }];
  
  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Big Roar',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, if this Pokémon is in the Active Spot, you may switch out your opponent\'s Active Pokémon to the Bench. (Your opponent chooses the new Active Pokémon.)'
  }];

  public attacks = [{
    name: 'Ram',
    cost: [CardType.LIGHTNING],
    damage: 10,
    text: ''
  }];

  public set: string = 'PAL';

  public set2: string = 'paldeaevolved';

  public setNumber: string = '69';

  public name: string = 'Shinx';

  public fullName: string = 'Shinx PAL';

}
