import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { KnockOutAttackEffect } from '../../../game/store/effects/game-effects';

export class Kingler extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Krabby';
  public hp: number = 90;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +20 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Crabhammer',
    cost: [C, C],
    damage: 30,
    text: ''
  },
  {
    name: 'Scissor Blow',
    cost: [W, W, C],
    damage: 80,
    text: 'If the Defending Pokémon would be be Knocked Out by this attack, Kingler does 30 damage to itself.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '20';
  public name: string = 'Kingler';
  public fullName: string = 'Kingler GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Scissor Blow
    if (effect instanceof KnockOutAttackEffect && effect.attack === this.attacks[1]) {
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      if (effect.player === owner) {
        return state;
      }
      if (owner.active.getPokemonCard() !== this) {
        return state;
      }
      owner.active.damage += 30;
    }

    return state;
  }
}
