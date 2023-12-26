import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, UseAttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class OriginFormePalkiaV extends PokemonCard {

  public tags = [ CardTag.POKEMON_V ];

  public regulationMark = 'F';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 220;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Rule the Region',
      cost: [ CardType.WATER ],
      damage: 0,
      text: 'Search your deck for a Stadium card, reveal it, and put it into your hand. Then, shuffle your deck.'
    },
    {
      name: 'Hydro Break',
      cost: [ CardType.WATER ],
      damage: 60,
      text: 'During your next turn, this Pokémon can\'t attack.'
    }
  ];

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '39';

  public name: string = 'Origin Forme Palkia V';

  public fullName: string = 'Origin Forme Palkia V ASR';

  public readonly HYDRO_BREAK_MARKER = 'HYDRO_BREAK_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Hydro Break
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      player.active.marker.addMarker(this.HYDRO_BREAK_MARKER, this);
    }

    if (effect instanceof UseAttackEffect && effect.player.active.marker.hasMarker(this.HYDRO_BREAK_MARKER, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.HYDRO_BREAK_MARKER, this);
    }

    return state;
  }

}
