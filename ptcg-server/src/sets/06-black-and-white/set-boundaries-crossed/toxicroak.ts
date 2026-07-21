import { ADD_POISON_TO_PLAYER_ACTIVE, AFTER_ATTACK, WAS_ATTACK_USED, WAS_POKEMON_KNOCKED_OUT_DURING_OPPONENTS_LAST_TURN } from '../../../game/store/prefabs/prefabs';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { State, StoreLike } from '../../../game';

export class Toxicroak extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Croagunk';
  public cardType: CardType = P;
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Revenge',
    cost: [C],
    damage: 20,
    damageCalculation: '+',
    text: 'If any of your Pokémon were Knocked Out by damage from an opponent\'s attack during his or her last turn, this attack does 70 more damage.'
  },
  {
    name: 'Poison Jab',
    cost: [P, C, C],
    damage: 60,
    text: 'The Defending Pokémon is now Poisoned.'
  }];

  public set: string = 'BCR';
  public setNumber: string = '66';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Toxicroak';
  public fullName: string = 'Toxicroak BCR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Revenge
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (WAS_POKEMON_KNOCKED_OUT_DURING_OPPONENTS_LAST_TURN(effect.player, { byAttackDamage: true })) {
        effect.damage += 70;
      }
    }

    // Poison Jab
    if (AFTER_ATTACK(effect, 1, this)) {
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}
