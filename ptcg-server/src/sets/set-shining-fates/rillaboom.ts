import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, EnergyType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, AttachEnergyPrompt, GameMessage, PlayerType, SlotType, GameError, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ABILITY_USED, HAS_MARKER, REMOVE_MARKER, SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';

export class Rillaboom extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 170;
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  public weakness = [{ type: CardType.FIRE }];
  public evolvesFrom = 'Thwackey';

  public powers = [{
    name: 'Voltage Beat',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may search your deck for up to 2 [G] Energy cards and attach them to 1 of your Pokemon. Then, shuffle your deck.'
  }];
  public attacks = [{
    name: 'Hammer In',
    cost: [CardType.GRASS, CardType.GRASS, CardType.GRASS, CardType.COLORLESS],
    damage: 140,
    text: ''
  }];

  public regulationMark: string = 'D';
  public setNumber = '14';
  public set: string = 'SSH';
  public name: string = 'Rillaboom';
  public fullName: string = 'Rillaboom SSH';
  public cardImage: string = 'assets/cardback.png';

  public readonly VOLTAGE_BEAT_MARKER = 'VOLTAGE_BEAT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.VOLTAGE_BEAT_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.VOLTAGE_BEAT_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      if (player.marker.hasMarker(this.VOLTAGE_BEAT_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.deck,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Grass Energy' },
        { allowCancel: true, min: 0, max: 2, sameTarget: true },
      ), transfers => {
        transfers = transfers || [];
        player.marker.addMarker(this.VOLTAGE_BEAT_MARKER, this);
        ABILITY_USED(player, this);

        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.deck.moveCardTo(transfer.card, target);
        }

        SHUFFLE_DECK(store, state, player);
      });

    }

    if (effect instanceof EndTurnEffect && HAS_MARKER(this.VOLTAGE_BEAT_MARKER, effect.player, this)) {
      REMOVE_MARKER(this.VOLTAGE_BEAT_MARKER, effect.player, this);
    }
    return state;
  }

}