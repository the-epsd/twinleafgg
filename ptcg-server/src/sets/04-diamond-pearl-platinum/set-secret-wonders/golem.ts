import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CONFIRMATION_PROMPT, DAMAGE_OPPONENT_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Golem extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Graveler';
  public hp: number = 130;
  public cardType: CardType[] = [F];
  public weakness = [{ type: G, value: +30 }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Double Throw',
    cost: [F, F, C],
    damage: 0,
    text: 'Choose 2 of your opponent\'s Pokémon. This attack does 30 damage to each of them. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Megaton Rock',
    cost: [F, F, F, C],
    damage: 80,
    text: 'You may do 40 damage instead of 80 to the Defending Pokémon. If you do, during your opponent\'s next turn, any damage done to Golem by attacks is reduced by 40 (after applying Weakness and Resistance).'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '29';
  public name: string = 'Golem';
  public fullName: string = 'Golem SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Double Throw
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const pokemonCount = opponent.getPokemonInPlay().length;
      if (pokemonCount === 0) {
        return state;
      }

      const max = Math.min(2, pokemonCount);
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: max, max, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        DAMAGE_OPPONENT_POKEMON(store, state, effect, 30, targets);
      });
    }

    // Megaton Rock
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {
          effect.damage = 40;
          player.active.damageReductionNextTurn = 40;
        }
      });
    }

    return state;
  }
}
