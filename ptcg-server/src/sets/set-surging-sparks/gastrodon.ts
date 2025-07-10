import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { GameError, GameMessage, StateUtils } from '../../game';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Gastrodon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Shellos';
  public cardType: CardType = W;
  public hp: number = 130;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Sticky Bind',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is on your Bench, Benched Stage 2 Pokémon (both yours and your opponent\'s) have no Abilities.'
  }];

  public attacks = [{
    name: 'Mud Shot',
    cost: [F, C, C],
    damage: 80,
    text: ''
  }];

  public set: string = 'SSP';
  public regulationMark = 'H';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '107';
  public name: string = 'Gastrodon';
  public fullName: string = 'Gastrodon SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.ABILITY) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // We are not blocking the Abilities from Non-Stage 2 Pokemon
      if (effect.card.stage !== Stage.STAGE_2) {
        return state;
      }

      // Check if Gastrodon is on the Bench
      const isGastrodonOnPlayerBench = player.bench.some(benchPokemon => benchPokemon.getPokemonCard() === this);
      const isGastrodonOnOpponentBench = opponent.bench.some(benchPokemon => benchPokemon.getPokemonCard() === this);

      if (!isGastrodonOnPlayerBench && !isGastrodonOnOpponentBench) {
        return state;
      }

      const gastrodonPlayer = isGastrodonOnPlayerBench ? player : opponent;
      if (IS_ABILITY_BLOCKED(store, state, gastrodonPlayer, this)) {
        return state;
      }

      if (!effect.power.exemptFromAbilityLock) {
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
    }

    return state;
  }
}