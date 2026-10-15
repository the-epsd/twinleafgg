import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PutCountersEffect } from '../../../game/store/effects/attack-effects';

export class Gastly extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [P];
  public weakness = [{ type: D }];
  public resistance = [{ type: C, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Pain Payback',
    cost: [P],
    damage: 0,
    text: 'Move 1 damage counter from Gastly to 1 of your opponent\'s Pokémon.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '82';
  public name: string = 'Gastly';
  public fullName: string = 'Gastly DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Pain Payback
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.active.damage <= 0) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false }
      ), targetTargets => {
        if (!targetTargets || targetTargets.length === 0) {
          return;
        }
        player.active.damage -= 10;
        const putCounters = new PutCountersEffect(effect, 10);
        putCounters.target = targetTargets[0];
        store.reduceEffect(state, putCounters);
      });
    }

    return state;
  }
}