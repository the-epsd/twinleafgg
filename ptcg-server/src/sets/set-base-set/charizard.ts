import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, BoardEffect } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EnergyCard, GameError, GameMessage, PlayerType, PowerType } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';


export class Charizard extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Charmeleon';

  public cardType: CardType = CardType.FIRE;

  public hp: number = 120;

  public weakness = [{
    type: CardType.WATER
  }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Energy Burn',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'As often as you like during your turn (before your attack), you may turn all Energy attached to Charizard into R Energy for the rest of the turn. This power can\'t be used if Charizard is Asleep, Confused, or Paralyzed.'
  }];

  public attacks = [
    {
      name: 'Fire Spin',
      cost: [CardType.FIRE, CardType.FIRE, CardType.FIRE, CardType.FIRE],
      damage: 100,
      text: 'Discard 2 Energy cards attached to Charizard in order to use this attack.'
    }
  ];

  public set: string = 'BS';

  public setNumber: string = '4';

  public name: string = 'Charizard';

  public fullName: string = 'Charizard BS';

  public cardImage: string = 'assets/cardback.png';

  public readonly ENERGY_BURN_MARKER = 'ENERGY_BURN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {

      const player = effect.player;

      // Get the energy map for the player
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      if (player.marker.hasMarker(this.ENERGY_BURN_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addBoardEffect(BoardEffect.ABILITY_USED);
        }
      });

      player.marker.addMarker(this.ENERGY_BURN_MARKER, this);
    }

    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this) && effect.player.marker.hasMarker(this.ENERGY_BURN_MARKER, this)) {
      effect.source.cards.forEach(c => {
        if (c instanceof EnergyCard && !effect.energyMap.some(e => e.card === c)) {
          effect.energyMap.push({ card: c, provides: [CardType.FIRE] });
        }
      });
    }

    if (effect instanceof AttackEffect && effect.player.marker.hasMarker(this.ENERGY_BURN_MARKER, this)) {
      effect.attack.cost = effect.attack.cost.map(() => CardType.FIRE);
    }


    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.ENERGY_BURN_MARKER, this);
    }
    return state;
  }
}