import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, FLIP_UNTIL_TAILS_AND_COUNT_HEADS } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../game/store/prefabs/attack-effects';

export class Lickilicky extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Lickitung';
  public cardType: CardType = C;
  public hp: number = 130;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Dangerous Lick',
      cost: [C, C, C],
      damage: 50,
      damageCalculation: '+' as '+',
      text: 'Flip a coin until you get tails. This attack does 50 more damage for each heads. If the first flip is tails, your opponent\'s Active Pokémon is now Paralyzed.'
    },
    {
      name: 'Rolling Tackle',
      cost: [C, C, C, C],
      damage: 110,
      text: ''
    }
  ];

  public set: string = 'UPR';
  public setNumber: string = '103';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Lickilicky';
  public fullName: string = 'Lickilicky UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Dangerous Lick
    // Refs: AGENTS-patterns.md (flip until tails), set-x-and-y/scolipede.ts (paralyzed on condition)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return FLIP_UNTIL_TAILS_AND_COUNT_HEADS(store, state, player, heads => {
        if (heads === 0) {
          // First flip was tails - paralyze
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        } else {
          effect.damage += 50 * heads;
        }
      });
    }

    return state;
  }
}
