import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, GameError } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

// CIN Lugia-GX 57 (https://limitlesstcg.com/cards/CIN/57)
export class LugiaGX extends PokemonCard {

  public tags = [CardTag.POKEMON_GX];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 190;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -20 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    { name: 'Psychic', cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS], damage: 30, text: 'This attack does 30 more damage times the amount of Energy attached to your opponent\'s Active Pokémon. ' },
    { name: 'Pelagic Blade', cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS], damage: 170, text: 'This Pokémon can\'t attack during your next turn.' },
    { name: 'Lost Purge-GX', cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS], damage: 0, text: 'Put your opponent\'s Active Pokémon and all cards attached to it in the Lost Zone. (You can\'t use more than 1 GX attack in a game.)' }
  ];

  public set: string = 'SUM';

  public setNumber = '159';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Lugia-GX';

  public fullName: string = 'Lugia-GX LOT';

  // for preventing the pokemon from attacking on the next turn
  public readonly PELAGIC_BLADE_MARKER = 'PELAGIC_BLADE_MARKER';
  public readonly PELAGIC_BLADE_2_MARKER = 'PELAGIC_BLADE_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Psychic
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const opponentProvidedEnergy = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, opponentProvidedEnergy);
      const opponentEnergyCount = opponentProvidedEnergy.energyMap
        .reduce((left, p) => left + p.provides.length, 0);

      effect.damage += opponentEnergyCount * 30;
    }

    // Pelagic Blade
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      // Check marker
      if (player.marker.hasMarker(this.PELAGIC_BLADE_MARKER, this)) {
        console.log('attack blocked');
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      player.marker.addMarker(this.PELAGIC_BLADE_MARKER, this);
      console.log('marker added');
    }

    // Lost Purge-GX
    if (effect instanceof AttackEffect && effect.attack === this.attacks[2]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check if player has used GX attack
      if (player.usedGX == true) {
        throw new GameError(GameMessage.LABEL_GX_USED);
      }
      // set GX attack as used for game
      player.usedGX = true;

      opponent.active.moveTo(opponent.lostzone);
      opponent.active.clearEffects();
    }

    // removing the markers for preventing the pokemon from attacking
    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      if (player.marker.hasMarker(this.PELAGIC_BLADE_2_MARKER, this)) {
        player.marker.removeMarker(this.PELAGIC_BLADE_MARKER, this);
        player.marker.removeMarker(this.PELAGIC_BLADE_2_MARKER, this);
        console.log('marker cleared');
      }

      if (player.marker.hasMarker(this.PELAGIC_BLADE_MARKER, this)) {
        player.marker.addMarker(this.PELAGIC_BLADE_2_MARKER, this);
        console.log('second marker added');
      }
    }

    return state;
  }
}