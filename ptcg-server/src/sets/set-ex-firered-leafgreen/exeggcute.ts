import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Exeggcute extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 50;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Psybeam',
    cost: [P],
    damage: 10,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
  },
  {
    name: 'Double Spin',
    cost: [C, C],
    damage: 20,
    damageCalculation: 'x',
    text: 'Flip 2 coins. This attack does 20 damage times the number of heads.'
  }];

  public set: string = 'RG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '33';
  public name: string = 'Exeggcute';
  public fullName: string = 'Exeggcute RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        let heads: number = 0;
        results.forEach(r => {
          if (r) heads++;
        });
        effect.damage = 20 * heads;
      });
    }

    return state;
  }
}