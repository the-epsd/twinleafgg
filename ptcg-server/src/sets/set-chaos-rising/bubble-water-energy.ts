import { CardType, EnergyType, SpecialCondition } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { IS_SPECIAL_ENERGY_BLOCKED, PREVENT_AND_CLEAR_SPECIAL_CONDITIONS } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';

export class BubbleWaterEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.WATER];
  public energyType = EnergyType.SPECIAL;
  public set: string = 'M4';
  public regulationMark = 'J';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '99';
  public name = 'Bubble Water Energy';
  public fullName = 'Bubble Water Energy M4';
  public text = 'This card can only be attached to [W] Pokémon. The [W] Pokémon this card is attached to cannot have any Special Conditions. Remove all Special Conditions from that Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttachEnergyEffect && effect.energyCard === this) {
      if (IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.player, this, effect.target)) {
        return state;
      }
      const checkPokemonType = new CheckPokemonTypeEffect(effect.target);
      store.reduceEffect(state, checkPokemonType);
      if (!checkPokemonType.cardTypes.includes(CardType.WATER)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      effect.target.removeSpecialCondition(SpecialCondition.ASLEEP);
      effect.target.removeSpecialCondition(SpecialCondition.PARALYZED);
      effect.target.removeSpecialCondition(SpecialCondition.CONFUSED);
      effect.target.removeSpecialCondition(SpecialCondition.POISONED);
      effect.target.removeSpecialCondition(SpecialCondition.BURNED);
    }
    PREVENT_AND_CLEAR_SPECIAL_CONDITIONS(state, effect, {
      shouldApply: (target, owner) => !!owner && target.cards.includes(this) && !IS_SPECIAL_ENERGY_BLOCKED(store, state, owner, this, target),
    });
    return state;
  }
}
