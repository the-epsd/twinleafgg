import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Altaria extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Swablu';
  public hp: number = 80;
  public cardType: CardType[] = [C];
  public weakness = [{ type: C, value: +20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Dragonbreath',
    cost: [C],
    damage: 40,
    text: 'Flip a coin. If tails, this attack does nothing. If heads, the Defending Pokémon is now Paralyzed.'
  },
  {
    name: 'Cotton Cloud',
    cost: [C, C, C],
    damage: 60,
    text: 'During your opponent\'s next turn, any damage done to Altaria by attacks from your opponent\'s Evolved Pokémon is reduced by 30 (after applying Weakness and Resistance).'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '12';
  public name: string = 'Altaria';
  public fullName: string = 'Altaria GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dragonbreath
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          effect.damage = 0;
        } else {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      });
    }

    // Cotton Cloud
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.active.damageReductionNextTurn = 30;
      effect.player.active.damageReductionNextTurnFilter = { sourceIsEvolution: true };
    }

    return state;
  }
}
