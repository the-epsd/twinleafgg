import { CardType, PokemonCard, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DRAW_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Solrock extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 90;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Double Draw',
    cost: [C],
    damage: 0,
    text: 'Draw 2 cards.'
  },
  {
    name: 'Solar Heat',
    cost: [F],
    damage: 20,
    damageCalculation: '+',
    text: 'If there is any Stadium card in play, this attack does 20 more damage.'
  }];

  public set: string = 'BUS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '69';
  public name: string = 'Solrock';
  public fullName: string = 'Solrock BUS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      DRAW_CARDS(effect.player, 2);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (StateUtils.getStadiumCard(state) !== undefined) {
        effect.damage += 20;
      }
    }

    return state;
  }
}