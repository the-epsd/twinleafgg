import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, AttachEnergyPrompt, EnergyCard, GameError, PlayerType, SlotType, StateUtils, PowerType } from '../../game';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class Solrock extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 90;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Sun Energy',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, you may attach a P Energy card from your discard pile to 1 of your Lunatone.'
  }];

  public attacks = [
    {
      name: 'Spinning Attack',
      cost: [ CardType.FIGHTING, CardType.COLORLESS ],
      damage: 50,
      text: ''
    }];

  public set: string = 'PGO';

  public name: string = 'Solrock';

  public fullName: string = 'Solrock PGO';

  public readonly SUN_ENERGY_MARKER = 'SUN_ENERGY_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.SUN_ENERGY_MARKER, this);
    }
  
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
  
      const hasBench = player.bench.some(b => b.cards.length > 0);
      if (!hasBench) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }


      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard
            && c.energyType === EnergyType.BASIC
            && c.provides.includes(CardType.PSYCHIC);
      });
      if (!hasEnergyInDiscard) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.marker.hasMarker(this.SUN_ENERGY_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
  
      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.BENCH, SlotType.ACTIVE ],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Psychic Energy' },
        { allowCancel: true, min: 1, max: 1 }
      ), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
          return;
        }
        player.marker.addMarker(this.SUN_ENERGY_MARKER, this);
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.discard.moveCardTo(transfer.card, target);
        }
      });
  
      return state;
    }
  
    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.SUN_ENERGY_MARKER, this);
    }
  
    return state;
  }
  
  
}
  