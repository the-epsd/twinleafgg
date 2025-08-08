import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { GameError, GameMessage, StateUtils } from '../../game';
import { BLOCK_RETREAT, BLOCK_RETREAT_IF_MARKER, IS_POKEBODY_BLOCKED, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from '../../game/store/prefabs/attack-effects';
import { MarkerConstants } from '../../game/store/markers/marker-constants';

export class Muk extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Grimer';
  public cardType: CardType = G;
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [{
    name: 'Stench',
    powerType: PowerType.POKEBODY,
    text: 'As long as Muk is your Active Pokémon, each player\'s Pokémon can\'t use any Poké-Powers.'
  }];

  public attacks = [{
    name: 'Poison Ring',
    cost: [G, C],
    damage: 20,
    text: 'The Defending Pokémon is now Poisoned. The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
  },
  {
    name: 'Sludge Toss',
    cost: [G, C, C],
    damage: 50,
    text: ''
  }];

  public set: string = 'LM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '11';
  public name: string = 'Muk';
  public fullName: string = 'Muk LM';

  public readonly POISON_RING_MARKER: string = 'POISON_RING_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.POKEPOWER) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Muk is not active Pokemon
      if (player.active.getPokemonCard() !== this
        && opponent.active.getPokemonCard() !== this) {
        return state;
      }

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      if (!effect.power.exemptFromAbilityLock) {
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
      return BLOCK_RETREAT(store, state, effect, this);
    }

    BLOCK_RETREAT_IF_MARKER(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);

    return state;
  }
}