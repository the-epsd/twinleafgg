import { CardTag, CardType, EnergyType, Stage } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { EnergyEffect } from '../../game/store/effects/play-card-effects';

export class NeoUpperEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.COLORLESS ];

  public tags = [ CardTag.ACE_SPEC ];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'TEF';

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '162';

  public name = 'Neo Upper Energy';

  public fullName = 'Neo Upper Energy TEF';

  public text =
    'As long as this card is attached to a Pokémon, it provides C Energy.' +
    '' +
    'If this card is attached to a Stage 2 Pokémon, this card provides every type of Energy but provides only 2 Energy at a time instead.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const player = effect.player;
      const pokemon = effect.source.getPokemonCard();

      try {
        const energyEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }

      if (pokemon && pokemon.stage == Stage.STAGE_2) {
        effect.energyMap.push({ card: this, provides: [CardType.ANY, CardType.ANY] });
      } else {
        effect.energyMap.push({ card: this, provides: [CardType.COLORLESS] });
      }
      return state;
    }
    return state;
  }
}