import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Koraidon extends PokemonCard {

  public tags = [CardTag.ANCIENT];

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = F;

  public hp: number = 130;

  public retreat = [C, C];

  public weakness = [{ type: P }];

  public attacks = [
    {
      name: 'Unrelenting Onslaught',
      cost: [C, C],
      damage: 30,
      damageCalculator: '+',
      text: 'If 1 of your other Ancient Pokémon used an attack during your last turn, this attack does 150 more damage.'
    },
    {
      name: 'Hammer In',
      cost: [F, F, C],
      damage: 110,
      text: ''
    }
  ];

  public set: string = 'SSP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '116';

  public name: string = 'Koraidon';

  public fullName: string = 'Koraidon SSP';

  public readonly UNRELENTING_ONSLAUGHT_MARKER = 'UNRELENTING_ONSLAUGHT_MARKER';
  public readonly UNRELENTING_ONSLAUGHT_2_MARKER = 'UNRELENTING_ONSLAUGHT_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      effect.player.marker.removeMarker(this.UNRELENTING_ONSLAUGHT_MARKER, this);
      effect.player.marker.removeMarker(this.UNRELENTING_ONSLAUGHT_2_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.UNRELENTING_ONSLAUGHT_2_MARKER, this)) {
      effect.player.marker.removeMarker(this.UNRELENTING_ONSLAUGHT_MARKER, this);
      effect.player.marker.removeMarker(this.UNRELENTING_ONSLAUGHT_2_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.UNRELENTING_ONSLAUGHT_MARKER, this)) {
      effect.player.marker.addMarker(this.UNRELENTING_ONSLAUGHT_2_MARKER, this);
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const playerLastAttackInfo = state.playerLastAttack?.[player.id];
      const originalCard = playerLastAttackInfo ? playerLastAttackInfo.sourceCard : null;

      if (originalCard && originalCard.tags.includes(CardTag.ANCIENT) && !player.marker.hasMarker(this.UNRELENTING_ONSLAUGHT_MARKER)) {
        effect.damage += 150;
      }
      player.marker.addMarker(this.UNRELENTING_ONSLAUGHT_MARKER, this);
    }
    return state;
  }

}