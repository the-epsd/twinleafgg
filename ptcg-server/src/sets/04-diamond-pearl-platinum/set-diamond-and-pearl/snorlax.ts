import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ADD_SLEEP_TO_PLAYER_ACTIVE, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { BLOCK_RETREAT } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Snorlax extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 100;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +20 }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Block',
    cost: [C],
    damage: 0,
    text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
  },
  {
    name: 'Ease Up',
    cost: [C, C, C, C],
    damage: 40,
    damageCalculation: '+',
    text: 'Snorlax is now Asleep. If Snorlax is evolved from Munchlax, this attack does 40 damage plus 30 more damage.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '37';
  public name: string = 'Snorlax';
  public fullName: string = 'Snorlax DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.player, this);
      if (effect.player.active.getPokemons().some(p => p.name === 'Munchlax')) {
        effect.damage += 30;
      }
    }

    return state;
  }
}
