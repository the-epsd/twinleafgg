import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  MovedFromActiveToBenchEffect,
  PlaceDamageCountersEffect,
} from '../../../game/store/effects/game-effects';
import { PokemonCardList } from '../../../game/store/state/pokemon-card-list';
import { IS_ABILITY_BLOCKED } from '../../../game/store/prefabs/prefabs';

export class TeamRocketsDugtrio extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  protected _tags = [CardTag.TEAM_ROCKET];
  public evolvesFrom: string = 'Team Rocket\'s Diglett';
  public hp: number = 100;
  public cardType: CardType[] = [F];
  public weakness = [{ type: G }];
  public retreat = [C];

  public powers = [{
    name: 'Holes',
    powerType: PowerType.ABILITY,
    text: 'Whenever your opponent\'s Active Pokémon moves to the Bench during their turn, place 2 damage counters on that Pokémon.'
  }];

  public attacks = [{
    name: 'Mud Shot',
    cost: [F, C],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '101';
  public name: string = 'Team Rocket\'s Dugtrio';
  public fullName: string = 'Team Rocket\'s Dugtrio ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Holes
    if (effect instanceof MovedFromActiveToBenchEffect) {
      const movingPlayer = effect.player;
      if (state.players[state.activePlayer] !== movingPlayer) {
        return state;
      }

      const abilityOwner = StateUtils.getOpponent(state, movingPlayer);
      if (!StateUtils.isPokemonInPlay(abilityOwner, this)) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, abilityOwner, this)) {
        return state;
      }

      const target = StateUtils.findCardList(state, effect.pokemonCard);
      if (!(target instanceof PokemonCardList)) {
        return state;
      }

      store.reduceEffect(
        state,
        new PlaceDamageCountersEffect(abilityOwner, target, 20, this, this.powers[0]),
      );
    }

    return state;
  }
}
