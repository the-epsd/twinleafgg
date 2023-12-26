import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Moltres extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  
  public cardType: CardType = CardType.FIRE;
  
  public hp: number = 120;

  public weakness = [{ type: CardType.WATER }];
  
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Inferno Wings',
    cost: [CardType.FIRE],
    damage: 20,
    text: 'If this Pokémon has any damage counters on it, this attack does 70 more damage. This attack\'s damage isn\'t affected by Weakness.'
  }];

  public set: string = 'BRS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '21';

  public name: string = 'Moltres';

  public fullName: string = 'Moltres BRS';

  public reduceEffect(store: StoreLike, state: State, effect: AttackEffect): State {

    if (effect.attack === this.attacks[0]) {
      
      // Check if this Pokemon has any damage
      if (effect.player.active.damage > 0) {
        effect.damage += 70;
      }
      
      // Make damage ignore weakness
      effect.ignoreWeakness = true;
    }
    return state;
  }
}