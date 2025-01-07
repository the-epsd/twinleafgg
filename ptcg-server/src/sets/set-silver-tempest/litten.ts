import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Litten extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIRE;
  public hp: number = 70;
  public weakness = [{ type: CardType.WATER }];
  
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Gnaw',
    cost: [CardType.FIRE],
    damage: 10,
    text: ''
  }, {
    name: 'Reprisal',
    cost: [CardType.FIRE, CardType.FIRE],
    damage: 20,
    damageCalculation: 'x',
    text: 'This attack does 20 damage for each damage counter on this Pokémon.'
  }];

  public set: string = 'SIT';
  public name: string = 'Litten';
  public fullName: string = 'Litten SIT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '30';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      effect.damage = player.active.damage * 2;
    }

    return state;
  }


}