import { StoreLike, State } from '../../game';
import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { IS_SPECIAL_ENERGY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class MedicalEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.COLORLESS];
  public energyType = EnergyType.SPECIAL;
  public set: string = 'PAR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '182';
  public name = 'Medical Energy';
  public fullName = 'Medical Energy PAR';
  public regulationMark = 'G';

  public text = 'As long as this card is attached to a Pokémon, it provides [C] Energy.\n\nWhen you attach this card from your hand to 1 of your Pokémon, heal 30 damage from that Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttachEnergyEffect && effect.energyCard === this) {
      const player = effect.player;

      if (IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.player, this, effect.target)) {
        return state;
      }

      const healEffect = new HealEffect(player, effect.target, 30);
      store.reduceEffect(state, healEffect);
    }

    return state;
  }
}