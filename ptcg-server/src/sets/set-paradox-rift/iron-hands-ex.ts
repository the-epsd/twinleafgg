
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';

export class IronHandsex extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.POKEMON_ex, CardTag.FUTURE];

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 230;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Arm Spike',
      cost: [CardType.COLORLESS],
      damage: 160,
      text: ''
    },
    {
      name: 'Extreme Amplifier',
      cost: [CardType.COLORLESS],
      damage: 120,
      text: 'If your opponent\'s Pokemon is Knocked Out by damage from this attack, take I more Prize card.'
    },
  ];

  public set: string = 'PAR';

  public name: string = 'Iron Hands ex';

  public fullName: string = 'Iron Hands ex PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const target = effect.target;

      if (target.hp <= 0) {
    
        const knockoutEffect = new KnockOutEffect(effect.player, target);
        knockoutEffect.prizeCount += 1;
        store.reduceEffect(state, knockoutEffect);
    
      }
    
      return state;
    
    }
    return state;
  }
}    