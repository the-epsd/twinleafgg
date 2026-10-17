import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ADD_POISON_TO_PLAYER_ACTIVE, ADD_SLEEP_TO_PLAYER_ACTIVE, HEAL_X_DAMAGE_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Parasect extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Paras';
  public hp: number = 90;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Wild Spores',
    cost: [G],
    damage: 20,
    text: 'If Parasect evolved from Paras during this turn, this attack does 40 damage and the Defending Pokémon is now Asleep and Poisoned.'
  },
  {
    name: 'Extend Fungus',
    cost: [G, G, C],
    damage: 60,
    text: 'Remove 2 damage counters from Parasect.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '58';
  public name: string = 'Parasect';
  public fullName: string = 'Parasect MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Wild Spores
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (effect.player.active.pokemonPlayedTurn === state.turn) {
        effect.damage = 40;
        ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
      }
    }

    // Extend Fungus
    if (WAS_ATTACK_USED(effect, 1, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 20);
    }

    return state;
  }
}
