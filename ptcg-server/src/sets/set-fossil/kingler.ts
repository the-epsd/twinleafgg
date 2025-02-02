import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Kingler extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Krabby';
  public cardType: CardType = CardType.WATER;
  public hp: number = 60;
  public weakness = [{ type: CardType.LIGHTNING }];
  public resistance = [];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Flail',
    cost: [W],
    damage: 10,
    text: 'Does 10 damage times the number of damage counters on Kingler.'
  },
  {
    name: 'Crabhammer',
    cost: [W, W, C],
    damage: 40,
    text: ''
  }];

  public set: string = 'FO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '38';
  public name: string = 'Kingler';
  public fullName: string = 'Kingler FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      effect.damage = player.active.damage;

      return state;
    }

    return state;
  }
}