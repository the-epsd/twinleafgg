import { Effect } from '../../../game/store/effects/effect';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, GameMessage } from '../../../game';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { AttachEnergyEffect, PlayStadiumEffect } from '../../../game/store/effects/play-card-effects';
import { PREVENT_DAMAGE, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Noivernex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Noibat';
  public tags = [CardTag.POKEMON_ex];
  public regulationMark = 'G';
  public cardType: CardType = CardType.DRAGON;
  public hp: number = 260;

  public attacks = [
    {
      name: 'Covert Flight',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 70,
      text: 'During your opponent\'s next turn, prevent all damage done to this Pokémon by attacks from Basic Pokémon.'
    },
    {
      name: 'Dominating Echo',
      cost: [CardType.PSYCHIC, CardType.DARK],
      damage: 140,
      text: 'During your opponent\'s next turn, they can\'t play any Special Energy or Stadium cards from their hand.'
    },
  ];

  public set: string = 'PAL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '153';
  public name: string = 'Noivern ex';
  public fullName: string = 'Noivern ex PAL';

  public readonly DOMINATING_ECHO_MARKER = 'DOMINATING_ECHO_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Covert Flight
    // Ref: set-delta-reign/ariados.ts (Covert Needle)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      PREVENT_DAMAGE(store, state, effect, this, { sourceStage: Stage.BASIC });
    }

    // Dominating Echo (marker — no EffectOfAttack prefab)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.marker.addMarker(this.DOMINATING_ECHO_MARKER, this);
    }

    if (effect instanceof PlayStadiumEffect) {
      const player = effect.player;
      if (player.marker.hasMarker(this.DOMINATING_ECHO_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (effect instanceof AttachEnergyEffect && effect.energyCard.energyType === EnergyType.SPECIAL) {
      const player = effect.player;
      if (player.marker.hasMarker(this.DOMINATING_ECHO_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (effect instanceof EndTurnEffect) {
      if (effect.player.marker.hasMarker(this.DOMINATING_ECHO_MARKER, this)) {
        effect.player.marker.removeMarker(this.DOMINATING_ECHO_MARKER, this);
      }
    }

    return state;
  }
}
