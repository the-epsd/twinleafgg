import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Attack } from '../../game/store/card/pokemon-types';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Dugtrio extends PokemonCard {

  public name = 'Dugtrio';
  
  public set = 'BS';
  
  public fullName = 'Dugtrio BS';
  
  public stage: Stage = Stage.STAGE_1;
  
  public cardType: CardType = CardType.FIGHTING;

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '19';

  public hp: number = 70;

  public weakness = [{
    type: CardType.GRASS
  }];

  public resistance = [{
    type: CardType.LIGHTNING,
    value: -30
  }];

  public retreat: CardType[] = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Slash',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
      damage: 40,
      text: ''
    },
    {
      name: 'Earthquake',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.FIGHTING, CardType.FIGHTING],
      damage: 70,
      text: 'Does 10 damage to each of your own Benched Pokémon. (Don’t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      
      effect.player.bench.forEach(b => {
        const benchDamage = new DealDamageEffect(effect, 10);
        benchDamage.target = b;
        store.reduceEffect(state, benchDamage);
      });
      
    }

    return state;
  }

}