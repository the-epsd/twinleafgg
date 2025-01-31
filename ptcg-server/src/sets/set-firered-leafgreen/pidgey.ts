import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';
import { GameError, GameMessage } from '../../game';
import { AttackEffect, RetreatEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Pidgey extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 50;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [ C ];

  public attacks = [{
    name: 'Corner',
    cost: [ C ],
    damage: 0,
    text: 'The Defending Pokémon can\’t retreat until the end of your opponent\’s next turn.'
  },
  {
    name: 'Gust',
    cost: [ C, C ],
    damage: 20,
    text: ''
  }];

  public set: string = 'RG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '73';
  public name: string = 'Pidgey';
  public fullName: string = 'Pidgey RG';
  
  public readonly DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.marker.addMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    }

    if (effect instanceof RetreatEffect && effect.player.active.marker.hasMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    }

    return state;
  }

}