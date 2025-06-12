import { CardTag, CardType, PokemonCard, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_POISON_TO_PLAYER_ACTIVE, THIS_ATTACK_DOES_X_MORE_DAMAGE, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class BruteBonnet extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.ANCIENT];
  public cardType: CardType = D;
  public hp: number = 120;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Poison Spray',
      cost: [D],
      damage: 0,
      text: 'Your opponent\'s Active Pokémon is now Poisoned.'
    },
    {
      name: 'Relentless Punches',
      cost: [D, D, D],
      damage: 50,
      damageCalculation: '+',
      text: 'This attack does 50 more damage for each damage counter on your opponent\'s Active Pokémon.'
    }
  ];

  public regulationMark: string = 'H';
  public set: string = 'TWM';
  public setNumber: string = '118';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Brute Bonnet';
  public fullName: string = 'Brute Bonnet TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, 5 * opponent.active.damage);
    }

    return state;
  }
}