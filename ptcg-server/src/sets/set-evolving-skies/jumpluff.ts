import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';


export class Jumpluff extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [ CardTag.RAPID_STRIKE ];

  public evolvesFrom = '';

  public cardType: CardType = CardType.GRASS;

  public weakness = [{ type: CardType.FIRE }];

  public hp: number = 90;

  public retreat = [  ];

  public powers = [{
    name: 'Fluffy Barrage',
    powerType: PowerType.ABILITY,
    text: 'This Pokémon may attack twice each turn. If the first attack Knocks Out your opponent\'s Active Pokémon, you may attack again after your opponent chooses a new Active Pokémon.'
  }];

  public attacks = [{
    name: 'Spinning Attack',
    cost: [ CardType.GRASS ],
    damage: 60,
    text: ''
  }];

  public set: string = 'EVS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '4';

  public name: string = 'Jumpluff';

  public fullName: string = 'Jumpluff EVS';

}