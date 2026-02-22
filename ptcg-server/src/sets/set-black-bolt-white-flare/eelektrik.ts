import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, GameError, GameMessage, EnergyCard, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { MOVE_CARDS, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Eelektrik extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Tynamo';
  public cardType: CardType = L;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public powers = [{
    name: 'Dynamotor',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, you may attach a [L] Energy card from your discard pile to 1 of your Benched Pokémon.'
  }];

  public attacks = [{
    name: 'Electric Ball',
    cost: [L, L, C],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'BLK';
  public setNumber: string = '31';
  public name: string = 'Eelektrik';
  public fullName: string = 'Eelektrik SV11B';
  public cardImage: string = 'assets/cardback.png';

  public readonly DYNAMOTOR_MAREKER = 'DYNAMOTOR_MAREKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.DYNAMOTOR_MAREKER, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      const hasBench = player.bench.some(b => b.cards.length > 0);
      if (!hasBench) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c.superType === SuperType.ENERGY
          && c.energyType === EnergyType.BASIC
          && (c as EnergyCard).provides.includes(CardType.LIGHTNING);
      });
      if (!hasEnergyInDiscard) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.marker.hasMarker(this.DYNAMOTOR_MAREKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Lightning Energy' },
        { allowCancel: true, min: 1, max: 1 }
      ), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
          return;
        }
        player.marker.addMarker(this.DYNAMOTOR_MAREKER, this);
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          MOVE_CARDS(store, state, player.discard, target, { cards: [transfer.card], sourceCard: this, sourceEffect: this.powers[0] });
        }
      });

      return state;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.DYNAMOTOR_MAREKER, this);
    }

    return state;
  }

}
