import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { COIN_FLIP_PROMPT, OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Poliwhirl extends PokemonCard {
  public stage = Stage.STAGE_1;
  public evolvesFrom = 'Poliwag';
  public hp = 60;
  public cardType = W;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks: Attack[] = [{
    name: 'Amnesia',
    cost: [W, W],
    text: 'Choose 1 of the Defending Pokémon\'s attacks. That Pokémon can\'t use that attack during your opponent\'s next turn.',
    damage: 0
  },
  {
    name: 'Doubleslap',
    cost: [W, W, C],
    damage: 30,
    text: 'Flip 2 coins. This attack does 30 damage times the number of heads.'
  }];

  public name = 'Poliwhirl';
  public set = 'BS';
  public setNumber: string = '38';
  public fullName = 'Poliwhirl BS';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK(store, state, effect, this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const attackEffect = effect;
      return COIN_FLIP_PROMPT(store, state, player, result1 => {
        COIN_FLIP_PROMPT(store, state, player, result2 => {
          const heads = (result1 ? 1 : 0) + (result2 ? 1 : 0);
          attackEffect.damage = heads * 30;
        });
      });
    }

    return state;
  }
}