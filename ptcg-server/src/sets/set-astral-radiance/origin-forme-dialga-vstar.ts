

import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import {
  StoreLike, State,
  GameError,
  GameMessage
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class OriginFormeDialgaVSTAR extends PokemonCard {

  public tags = [CardTag.POKEMON_VSTAR];

  public regulationMark = 'F';

  public stage: Stage = Stage.VSTAR;

  public evolvesFrom = 'Origin Forme Dialga V';

  public cardType: CardType = CardType.METAL;

  public hp: number = 280;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Metal Blast',
      cost: [CardType.COLORLESS],
      damage: 40,
      text: 'This attack does 40 more damage for each [M] Energy attached to this Pokémon.'
    },
    {
      name: 'Star Chronos',
      cost: [CardType.METAL, CardType.METAL, CardType.METAL, CardType.METAL, CardType.COLORLESS],
      damage: 220,
      text: 'Take another turn after this one. (Skip Pokémon Checkup.) (You can\'t use more than 1 VSTAR Power in a game.)'
    }
  ];

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '114';

  public name: string = 'Origin Forme Dialga VSTAR';

  public fullName: string = 'Origin Forme Dialga VSTAR ASR';

  public readonly STAR_CHRONOS_MARKER = 'STAR_CHRONOS_MARKER';

  public readonly STAR_CHRONOS_MARKER_2 = 'STAR_CHRONOS_MARKER_2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.STAR_CHRONOS_MARKER_2, this)) {
      effect.player.marker.removeMarker(this.STAR_CHRONOS_MARKER, this);
      effect.player.marker.removeMarker(this.STAR_CHRONOS_MARKER_2, this);
      effect.player.usedTurnSkip = false;
      console.log('marker cleared');
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.STAR_CHRONOS_MARKER, this)) {
      effect.player.marker.addMarker(this.STAR_CHRONOS_MARKER_2, this);
      console.log('marker added');
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount += em.provides.filter(cardType => {
          return cardType === CardType.METAL;
        }).length;
      });
      effect.damage += energyCount * 40;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      if (player.usedVSTAR === true) {
        throw new GameError(GameMessage.LABEL_VSTAR_USED);
      }
      player.usedVSTAR = true;
      player.marker.addMarker(this.STAR_CHRONOS_MARKER, this);
      effect.player.usedTurnSkip = true;
    }

    return state;
  }
}
