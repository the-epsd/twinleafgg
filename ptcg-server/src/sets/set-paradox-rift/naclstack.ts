import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Naclstack extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Nacli';
  public regulationMark: string = 'G';
  public cardType: CardType = CardType.FIGHTING;
  public hp: number = 100;
  public weakness = [{ type: CardType.GRASS }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Rocky Tackle',
    cost: [CardType.FIGHTING, CardType.FIGHTING],
    damage: 80,
    text: 'This Pokemon does 30 damage to itself.'
  }];

  public set: string = 'PAR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '103';
  public name: string = 'Naclstack';
  public fullName: string = 'Naclstack PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 30);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }

    return state;
  }
}