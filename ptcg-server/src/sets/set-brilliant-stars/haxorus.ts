import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Haxorus extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public cardType: CardType = CardType.DRAGON;
  public evolvesFrom = 'Fraxure';
  public hp: number = 170;
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Slash',
    cost: [CardType.COLORLESS],
    damage: 60,
    text: ''
  },
  {
    name: 'Wild Axe',
    cost: [CardType.FIGHTING, CardType.METAL],
    damage: 160,
    text: 'This Pokémon also does 30 damage to itself.'
  }];

  public set = 'BRS';
  public regulationMark = 'F';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '112';
  public name = 'Haxorus';
  public fullName = 'Haxorus BRS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 60);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }

    return state;
  }

}