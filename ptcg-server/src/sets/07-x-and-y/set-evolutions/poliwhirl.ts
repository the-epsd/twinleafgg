import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Poliwhirl extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness = [{ type: G }];
  public retreat = [C];
  public evolvesFrom = 'Poliwag';

  public attacks = [{
    name: 'Amnesia',
    cost: [W, W],
    damage: 30,
    text: 'Choose 1 of your opponent\'s Active Pokémon\'s attacks. That Pokémon can\'t use that attack during your opponent\'s next turn.'
  },
  {
    name: 'Double Slap',
    cost: [W, W, C],
    damage: 50,
    text: 'Flip 2 coins. This attack does 50 damage times the number of heads.'
  }];

  public set: string = 'EVO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '24';
  public name: string = 'Poliwhirl';
  public fullName: string = 'Poliwhirl EVO';

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
