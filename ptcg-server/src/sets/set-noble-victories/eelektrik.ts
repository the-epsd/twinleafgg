import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameError, GameMessage, EnergyCard, SlotType } from '../../game';
import { ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON, IS_ABILITY_BLOCKED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { Effect } from '../../game/store/effects/effect';

import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Eelektrik extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Tynamo';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 90;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Dynamotor',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may attach a L ' +
      'Energy card from your discard pile to 1 of your Benched Pokemon.'
  }];

  public attacks = [
    {
      name: 'Electric Ball',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: 50,
      text: ''
    }
  ];

  public set: string = 'NVI';

  public name: string = 'Eelektrik';

  public fullName: string = 'Eelektrik NVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '40';

  public readonly DYNAMOTOR_MARKER = 'DYNAMOTOR_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.DYNAMOTOR_MARKER, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const hasBench = player.bench.some(b => b.cards.length > 0);
      if (!hasBench) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c.superType === SuperType.ENERGY
          && (c as EnergyCard).energyType === EnergyType.BASIC
          && (c as EnergyCard).provides.includes(CardType.LIGHTNING);
      });
      if (!hasEnergyInDiscard) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.marker.hasMarker(this.DYNAMOTOR_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      /*
       * Legacy pre-prefab implementation:
       * - used AttachEnergyPrompt directly from discard to bench
       * - manually resolved transfer targets and moved cards
       * - set DYNAMOTOR marker only if at least 1 transfer was made
       */
      // Converted to prefab version (ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON).
      state = ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON(
        store,
        state,
        player,
        1,
        CardType.LIGHTNING,
        {
          destinationSlots: [SlotType.BENCH],
          energyFilter: { energyType: EnergyType.BASIC, name: 'Lightning Energy' },
          min: 1,
          allowCancel: true,
          onAttached: transfers => {
            if (transfers.length > 0) {
              player.marker.addMarker(this.DYNAMOTOR_MARKER, this);
            }
          }
        }
      );

      return state;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.DYNAMOTOR_MARKER, this);
    }

    return state;
  }

}
