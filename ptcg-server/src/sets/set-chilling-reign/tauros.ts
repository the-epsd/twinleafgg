import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Tauros extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.COLORLESS;
  public hp: number = 130;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Raging Bull',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 20,
    text: 'Does 20 more damage for each damage counter on this Pokemon. This Pokemon is now Confused.'
  },
  {
    name: 'Take Down',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 80,
    text: 'This Pokemon also does 30 damage to itself.'
  }];

  public set: string = 'CRE';
  public regulationMark: string = 'E';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '115';
  public name: string = 'Tauros';
  public fullName: string = 'Tauros CRE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if(effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      effect.damage += effect.player.active.damage * 2;

      const active = player.active;
      active.addSpecialCondition(SpecialCondition.CONFUSED);

      return state;
    }

    if(effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 30);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }
    
    return state;
  }
}