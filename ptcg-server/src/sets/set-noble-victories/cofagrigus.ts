import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType, SlotType, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';

export class Cofagrigus extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Yamask';
  public cardType: CardType = P;
  public hp: number = 90;
  public weakness = [{ type: D }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Damagriiigus',
      cost: [P],
      damage: 0,
      text: 'Move up to 3 damage counters from 1 of your Pokémon to 1 of your opponent\'s Pokémon.'
    },
    {
      name: 'Perplex',
      cost: [P, C, C],
      damage: 30,
      text: 'The Defending Pokémon is now Confused.'
    }
  ];

  public set: string = 'NVI';
  public setNumber: string = '46';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cofagrigus';
  public fullName: string = 'Cofagrigus NVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Damagriiigus - move up to 3 damage counters from your Pokémon to opponent's
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      // Check if any of player's Pokémon has damage
      const damagedPokemon: any[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.damage > 0) {
          damagedPokemon.push(cardList);
        }
      });

      if (damagedPokemon.length === 0) {
        return state;
      }

      // Choose source Pokémon
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
        if (source.damage === 0) {
          return;
        }

        // Calculate how many damage counters can be moved (max 3)
        const maxCounters = Math.min(3, Math.floor(source.damage / 10));

        // Choose target Pokémon
        store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { allowCancel: true }
        ), targetTargets => {
          if (!targetTargets || targetTargets.length === 0) {
            return;
          }

          const target = targetTargets[0];

          // Move up to 3 damage counters
          const damageToMove = maxCounters * 10;
          source.damage -= damageToMove;
          target.damage += damageToMove;
        });
      });
    }

    // Perplex
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const addSpecialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      store.reduceEffect(state, addSpecialCondition);
    }

    return state;
  }
}
