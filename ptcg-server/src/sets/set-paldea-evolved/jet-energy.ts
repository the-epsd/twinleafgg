import { StoreLike, State } from '../../game';
import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyEffect, EnergyEffect } from '../../game/store/effects/play-card-effects';

export class JetEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '190';

  public regulationMark = 'G';

  public name = 'Jet Energy';

  public fullName = 'Jet Energy PAL';

  public text = 'As long as this card is attached to a Pokémon, it provides [C] Energy.' +
    '' +
    'When you attach this card from your hand to 1 of your Benched Pokémon, switch that Pokémon with your Active Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttachEnergyEffect && effect.energyCard === this) {
      const player = effect.player;
      const target = effect.target;

      try {
        const energyEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }
      // Switch the active Pokemon only if the EnergyEffect is successful
      player.switchPokemon(target);
      console.log('special energy worked');
    }

    return state;
  }
}