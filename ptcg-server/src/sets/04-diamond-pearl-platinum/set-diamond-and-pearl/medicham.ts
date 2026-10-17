import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DealDamageEffect, PutCountersEffect } from '../../../game/store/effects/attack-effects';

export class Medicham extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Meditite';
  public hp: number = 90;
  public cardType: CardType[] = [F];
  public weakness = [{ type: P, value: 20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Force Palm',
    cost: [F],
    damage: 0,
    text: 'Count the number of damage counters on Medicham. Put that many damage counters on 1 of your opponent\'s Pokémon.'
  },
  {
    name: 'Spinning Kick',
    cost: [F, F, C],
    damage: 80,
    text: 'Medicham does 20 damage to itself.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '32';
  public name: string = 'Medicham';
  public fullName: string = 'Medicham DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Force Palm
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const counters = Math.floor(player.active.damage / 10);
      if (counters === 0) {
        return state;
      }
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const putCounters = new PutCountersEffect(effect, counters * 10);
        putCounters.target = targets[0];
        store.reduceEffect(state, putCounters);
      });
    }

    // Spinning Kick
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const damage = new DealDamageEffect(effect, 20);
      damage.target = effect.player.active;
      store.reduceEffect(state, damage);
    }

    return state;
  }
}
