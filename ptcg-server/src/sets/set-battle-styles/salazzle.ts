import { Attack, CardType, PokemonCard, Stage, State, StateUtils, StoreLike, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, AFTER_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Salazzle extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Salandit';
  public cardType: CardType = R;
  public hp: number = 90;
  public weakness: Weakness[] = [{ type: W }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [{
    name: 'Perplex',
    cost: [R],
    damage: 0,
    text: 'Your opponent\'s Active Pokémon is now Confused.'
  },
  {
    name: 'Derisive Roasting',
    cost: [C, C],
    damage: 90,
    damageCalculation: 'x',
    text: 'This attack does 90 damage for each Special Condition affecting your opponent\'s Active Pokémon.'
  }];

  public set: string = 'BST';
  public regulationMark = 'E';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '28';
  public name: string = 'Salazzle';
  public fullName: string = 'Salazzle BST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const oppActive = opponent.active;

      effect.damage = 90 * oppActive.specialConditions.length;
    }

    return state;
  }
}