import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';

export class Lunatone extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 90;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'New Moon',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'If you have Solrock in play, prevent all effects of any Stadium ' +
    'done to your Pokémon in play.'
  }];

  public attacks = [{
    name: '',
    cost: [  ],
    damage: 100,
    text: ''
  }];

  public set: string = 'OBF';

  public set2: string = 'obsidianflames';

  public setNumber: string = '92';

  public name: string = 'Lunatone';

  public fullName: string = 'Lunatone OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof UseStadiumEffect) {
      const target = effect.player;
      
      if (this.powers.some(a => a.name === 'New Moon') && target === effect.player) {
        // Ignore stadium effect
        return state; 
      }
    }
  
    return state;
  
  }
}