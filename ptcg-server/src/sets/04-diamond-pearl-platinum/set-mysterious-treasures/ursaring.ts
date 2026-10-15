import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealTargetEffect } from '../../../game/store/effects/attack-effects';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../../game/store/prefabs/attack-effects';
import { ARM_OUTGOING_ATTACK_DAMAGE_BONUS_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Ursaring extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Teddiursa';
  public hp: number = 100;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Bad Temper',
    cost: [C, C],
    damage: 30,
    text: 'The Defending Pokémon is now Confused. During your opponent\'s next turn, that Pokémon\'s attacks do 60 more damage to the Active Pokémon (before applying Weakness and Resistance).'
  },
  {
    name: 'Defensive Claw',
    cost: [C, C, C, C],
    damage: 60,
    damageCalculation: '+',
    text: 'If Teddiursa is on your Bench, this attack does 60 damage plus 20 more damage. If Teddiursa is on your Bench and has any damage counters on it, this attack does 60 damage plus 40 more damage and remove all damage counters from that Pokémon.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '38';
  public name: string = 'Ursaring';
  public fullName: string = 'Ursaring MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Bad Temper
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
      ARM_OUTGOING_ATTACK_DAMAGE_BONUS_NEXT_TURN(opponent.active, 60);
    }

    // Defensive Claw
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      let teddiursaSlot = player.bench.find(slot => slot.getPokemonCard()?.name === 'Teddiursa' && slot.damage > 0);
      const hasDamaged = !!teddiursaSlot;
      if (!teddiursaSlot) {
        teddiursaSlot = player.bench.find(slot => slot.getPokemonCard()?.name === 'Teddiursa');
      }

      if (teddiursaSlot) {
        if (hasDamaged) {
          effect.damage += 40;
          const healEffect = new HealTargetEffect(effect, teddiursaSlot.damage);
          healEffect.target = teddiursaSlot;
          store.reduceEffect(state, healEffect);
        } else {
          effect.damage += 20;
        }
      }
    }

    return state;
  }
}
