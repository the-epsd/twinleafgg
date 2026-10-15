import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CONFIRMATION_PROMPT, FLIP_UNTIL_TAILS_AND_COUNT_HEADS, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON } from '../../../game/store/prefabs/attack-effects';
import { HealEffect } from '../../../game/store/effects/game-effects';

export class Lopunny extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Buneary';
  public hp: number = 80;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: 20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Healing Wish',
    cost: [C],
    damage: 0,
    text: 'Flip a coin until you get tails. Remove a number of damage counters equal to the number of heads from 1 of your Pokémon.'
  },
  {
    name: 'Flop',
    cost: [C, C, C],
    damage: 30,
    text: 'Does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) You may switch Lopunny with 1 of your Benched Pokémon.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '30';
  public name: string = 'Lopunny';
  public fullName: string = 'Lopunny DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Healing Wish
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      FLIP_UNTIL_TAILS_AND_COUNT_HEADS(store, state, player, heads => {
        if (heads === 0) {
          return;
        }

        store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_HEAL,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { allowCancel: false, min: 1, max: 1 }
        ), targets => {
          if (!targets || targets.length === 0) {
            return;
          }
          const healEffect = new HealEffect(player, targets[0], heads * 10);
          store.reduceEffect(state, healEffect);
        });
      });
    }

    // Flop
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(20, effect, store, state);

      const player = effect.player;
      const hasBench = player.bench.some(b => b.cards.length > 0);
      if (hasBench) {
        CONFIRMATION_PROMPT(store, state, player, wantToSwitch => {
          if (wantToSwitch) {
            SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
          }
        }, GameMessage.WANT_TO_SWITCH_POKEMON);
      }
    }

    return state;
  }
}
