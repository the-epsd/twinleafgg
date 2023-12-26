import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PokemonCardList, StateUtils } from '../../game';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';


export class Doduo extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public evolvesFrom = 'Doduo';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 70;

  // public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Reckless Charge',
      cost: [CardType.COLORLESS],
      damage: 30,
      text: 'This Pokémon also does 10 damage to itself.'
    }
  ];

  public set: string = '151';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '84';

  public name: string = 'Doduo';

  public fullName: string = 'Doduo MEW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
  
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;

      if (cardList === undefined) {
        return state;
      }

      const dealDamage = new DealDamageEffect(effect, 10);
      dealDamage.target = cardList;
      return store.reduceEffect(state, dealDamage);
    }
    return state;
  }
}