import { StoreLike } from '../../game/store/store-like';
import { State, GamePhase } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { EnergyCard, CardType, EnergyType, CardTag } from '../../game';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { EnergyEffect } from '../../game/store/effects/play-card-effects';

export class LegacyEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.COLORLESS ];
  
  public energyType = EnergyType.SPECIAL;

  public tags = [ CardTag.ACE_SPEC ];
  
  public set: string = 'TWM';
  
  public regulationMark = 'G';
  
  public cardImage: string = 'assets/cardback.png';
  
  public setNumber: string = '167';
  
  public name = 'Legacy Energy';
  
  public fullName = 'Legacy Energy TWM';

  private legacyEnergyUsed = false;

  public text: string =
    'As long as this card is attached to a Pokémon, it provides every type of Energy but provides only 1 Energy at a time.' +
    '' +
    'If the Pokémon this card is attached to is Knocked Out by damage from an attack from your opponent\'s Pokémon, that player takes 1 fewer Prize card. This effect of your Legacy Energy can\'t be applied more than once per game.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const player = effect.player;

      try {
        const energyEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }
      
      effect.energyMap.push({ card: this, provides: [ CardType.ANY ] });
    }
    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this)) {
      if (state.phase === GamePhase.ATTACK) {
        const player = effect.player;
        
        try {
          const energyEffect = new EnergyEffect(player, this);
          store.reduceEffect(state, energyEffect);
        } catch {
          return state;
        }

        if (this.legacyEnergyUsed == false) {
          effect.prizeCount -= 1;
          this.legacyEnergyUsed = true;
        }
      }
    }

    return state;
  }

}
