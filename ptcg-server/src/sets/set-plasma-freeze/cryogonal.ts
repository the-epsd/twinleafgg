import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { UseAttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import {
  WAS_ATTACK_USED, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND
} from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class Cryogonal extends PokemonCard {
  public tags = [CardTag.TEAM_PLASMA];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Call Sign',
      cost: [C],
      damage: 0,
      text: 'Search your deck for a Water Pokémon, reveal it, and put it into your hand. Shuffle your deck afterward.'
    },
    {
      name: 'Cryofreeze',
      cost: [W],
      damage: 10,
      text: 'Discard an Energy attached to this Pokémon. The Defending Pokémon can\'t attack during your opponent\'s next turn.'
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '30';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cryogonal';
  public fullName: string = 'Cryogonal PLF';

  public readonly DEFENDING_POKEMON_CANNOT_ATTACK_MARKER = 'CRYOGONAL_DEFENDING_CANNOT_ATTACK_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Call Sign - search deck for a Water Pokemon
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, player, {
        cardType: CardType.WATER
      });
    }

    // Attack 2: Cryofreeze
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Discard an energy from this Pokemon
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);

      // Defending Pokemon can't attack during opponent's next turn
      opponent.active.marker.addMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this);
    }

    // Block attacks when marker is present
    if (effect instanceof UseAttackEffect
      && effect.player.active.marker.hasMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    // Clean up marker at end of turn
    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this);
    }

    return state;
  }
}
