import { PokemonCard } from '../../game/store/card/pokemon-card'; 
import { Stage, CardType, CardTag, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { AddSpecialConditionsEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class GengarV extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.POKEMON_V, CardTag.SINGLE_STRIKE];

  public cardType: CardType = CardType.DARK;
  
  public hp = 210;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Dark Slumber',
      cost: [CardType.DARK, CardType.DARK],
      damage: 40,
      text: 'Your opponent\'s Active Pokémon is now Asleep.'
    },
    {
      name: 'Pain Explosion',
      cost: [CardType.DARK, CardType.DARK, CardType.DARK],  
      damage: 190,
      text: 'Put 3 damage counters on this Pokémon.'
    }
  ];

  public set: string = 'FST';

  public regulationMark = 'E';

  public cardImage: string = 'assets/cardback.png';
  
  public setNumber: string = '156';
  
  public name: string = 'Gengar V';
  
  public fullName: string = 'Gengar V FST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      store.reduceEffect(state, specialConditionEffect);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;
  
      const dealDamage = new DealDamageEffect(effect, 30);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }
    return state;
  }
  
}