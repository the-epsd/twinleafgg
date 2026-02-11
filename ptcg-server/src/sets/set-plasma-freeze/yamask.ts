import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, ChoosePokemonPrompt, PlayerType, SlotType } from '../../game';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Yamask extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 50;
  public weakness = [{ type: D }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Transfer Pain',
      cost: [P],
      damage: 0,
      text: 'Move 1 damage counter from any of your Pokémon to any of your opponent\'s Pokémon.'
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '54';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Yamask';
  public fullName: string = 'Yamask PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Transfer Pain
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      // Check if any of player's Pokemon have damage
      let hasDamaged = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.damage > 0) {
          hasDamaged = true;
        }
      });

      if (!hasDamaged) {
        return state;
      }

      // Choose source: one of your Pokemon with damage
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: true }
      ), sourceTargets => {
        if (!sourceTargets || sourceTargets.length === 0) {
          return;
        }

        const source = sourceTargets[0];
        if (source.damage <= 0) {
          return;
        }

        // Choose target: one of opponent's Pokemon
        store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { allowCancel: false }
        ), targetTargets => {
          if (!targetTargets || targetTargets.length === 0) {
            return;
          }

          const target = targetTargets[0];

          // Remove 1 damage counter from source
          source.damage -= 10;

          // Put 1 damage counter on target
          const putCounters = new PutCountersEffect(effect, 10);
          putCounters.target = target;
          store.reduceEffect(state, putCounters);
        });
      });
    }

    return state;
  }
}
