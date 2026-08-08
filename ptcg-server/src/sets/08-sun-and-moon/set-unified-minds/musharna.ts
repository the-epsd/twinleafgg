import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from "../../../game/store/prefabs/attack-effects";
import { WAS_ATTACK_USED, ADD_SLEEP_TO_PLAYER_ACTIVE, NEXT_TURN_ATTACK_BONUS_ALL_ATTACKS } from "../../../game/store/prefabs/prefabs";

export class Musharna extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Munna';
  public cardType: CardType = P;
  public hp: number = 100;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Rest Well',
    cost: [C],
    damage: 0,
    text: 'Both Active Pokémon are now Asleep. During your next turn, this Pokémon\'s attacks do 100 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
  },
  {
    name: 'Zen Headbutt',
    cost: [C],
    damage: 50,
    text: ''
  }];

  public set: string = 'UNM';
  public setNumber: string = '89';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Musharna';
  public fullName: string = 'Musharna UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, player, this);
    }

    // Ref: set-fates-collide/serperior.ts (Coil - NEXT_TURN_ATTACK_BONUS_ALL_ATTACKS)
    NEXT_TURN_ATTACK_BONUS_ALL_ATTACKS(effect, {
      source: this,
      bonusDamage: 100,
      setupAttack: this.attacks[0],
    });

    return state;
  }
}
