import { GameError, GameMessage, PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class Mareep extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 50;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.METAL, value: -20 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Tackle',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 20,
    text: ''
  }];

  public powers = [{
    name: 'Fluffy Pillow',
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), if this Pokémon is your Active Pokémon, you may leave your opponent\'s Active Pokémon Asleep.',
    useWhenInPlay: true
  }];

  public set: string = 'LOT';
  public fullName: string = 'Mareep LOT';
  public name: string = 'Mareep';
  public setNumber: string = '75';
  public cardImage: string = 'assets/cardback.png';

  public FLUFFY_PILLOW_MARKER = 'FLUFFY_PILLOW_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.FLUFFY_PILLOW_MARKER, this);
      return state;
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {

      const player = effect.player;
      if (player.marker.hasMarker(this.FLUFFY_PILLOW_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (player.active.cards[0] !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER); // Not active
      }

      player.marker.addMarker(this.FLUFFY_PILLOW_MARKER, this);
      const opponent = StateUtils.getOpponent(state, player);

      opponent.active.addSpecialCondition(SpecialCondition.ASLEEP);
      return state;
    }

    if (effect instanceof EndTurnEffect) {
      const player = (effect as EndTurnEffect).player;
      player.marker.removeMarker(this.FLUFFY_PILLOW_MARKER, this);
    }

    return state;
  }
}