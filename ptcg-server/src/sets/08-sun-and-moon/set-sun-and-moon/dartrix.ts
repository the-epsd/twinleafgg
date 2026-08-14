import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import {
  StoreLike,
  State,
  GameMessage,
  PlayerType,
  SlotType,
  ChoosePokemonPrompt,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';

import { StateUtils } from '../../../game/store/state-utils';

import { DAMAGE_OPPONENT_POKEMON, WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';

// CIN Dartrix 57 (https://limitlesstcg.com/cards/CIN/57)
export class Dartrix extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Rowlet';
  public cardType: CardType = G;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Sharp Blade Quill',
    cost: [C],
    damage: 0,
    text: 'This attack does 20 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }, {
    name: 'Leaf Blade',
    cost: [G, C, C], 
    damage: 50, 
    text: 'Flip a coin. If heads, this attack does 20 more damage.'
  }];

  public set: string = 'SUM';
  public setNumber = '10';
  public cardImage = 'assets/cardback.png';
  public name: string = 'Dartrix';
  public fullName: string = 'Dartrix SUM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sharp Blade Quill
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBenched = opponent.bench.some((b) => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { allowCancel: false },
        ),
        (selected) => {
          const targets = selected || [];
          DAMAGE_OPPONENT_POKEMON(store, state, effect, 20, targets);
        },
      );
    }

    // Leaf Blade
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      return COIN_FLIP_PROMPT(store, state, player, results => {
        if (results === true) {
          effect.damage += 20;
        }
      });

    }

    return state;
  }
}
