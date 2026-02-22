import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, ChoosePokemonPrompt, PlayerType, SlotType, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Mismagius extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Misdreavus';
  public cardType: CardType = P;
  public hp: number = 110;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Assassin\'s Magic',
      cost: [P, C],
      damage: 60,
      text: 'If your opponent\'s Active Pokémon is affected by a Special Condition, place 6 damage counters on 1 of your opponent\'s Benched Pokémon.'
    }
  ];

  public regulationMark: string = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '86';
  public name: string = 'Mismagius';
  public fullName: string = 'Mismagius M2a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check if opponent's active Pokemon has any special conditions
      if (opponent.active.specialConditions.length > 0) {
        // Check if opponent has benched Pokemon
        const benchedPokemon = opponent.bench.filter(b => b.cards.length > 0);

        if (benchedPokemon.length > 0) {
          // Prompt player to choose a benched Pokemon to damage
          return store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
            PlayerType.TOP_PLAYER,
            [SlotType.BENCH],
            { min: 1, max: 1, allowCancel: false }
          ), (selected: PokemonCardList[] | null) => {
            if (selected && selected.length > 0) {
              const putCountersEffect = new PutCountersEffect(effect, 60);
              putCountersEffect.target = selected[0];
              store.reduceEffect(state, putCountersEffect);
            }
          });
        }
      }
    }
    return state;
  }
}