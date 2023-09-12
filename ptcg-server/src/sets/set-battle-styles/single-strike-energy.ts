import { CardTag, CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { StateUtils } from '../../game/store/state-utils';

export class SingleStrikeEnergy extends EnergyCard {

  public cardTag: CardTag[] = [CardTag.SINGLE_STRIKE];

  public provides: CardType[] = [ CardType.DARK | CardType.FIGHTING ];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'BST';

  public name = 'Single Strike Energy';

  public fullName = 'Single Strike Energy BST';

  public text = 'This card can only be attached to a Single Strike Pokémon.' +
    'If this card is attached to anything other than a Single ' +
    'Strike Pokémon, discard this card. ' +
    '' +
    'As long as this card is attached to a Pokémon, it provides ' +
    'F and D Energy but provides only 1 Energy at a time, and the ' +
    'attacks of the Pokémon this card is attached to do 20 more ' +
    'damage to your opponent\'s Active Pokémon (before applying ' +
    'Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof DealDamageEffect) {
      if (effect.source.cards.includes(this)) {
        const player = effect.player;
        const opponent = StateUtils.getOpponent(state, player);


        if (effect.target !== opponent.active) {
          return state; 
        }
            
        const source = effect.source; // Get source Pokemon
        const checkPokemonType = new CheckPokemonTypeEffect(source); 
        store.reduceEffect(state, checkPokemonType);
      
        const card = source.getPokemonCard(); // Get source Pokemon card
      
        if (card && !card.tags.includes(CardTag.SINGLE_STRIKE)) {
          // If attached Pokemon is not Single Strike, discard energy
          player.discard.moveCardTo(this, player.discard); 
          return state;
        }
      
        if (checkPokemonType.cardTypes.includes(CardType.FIGHTING) || checkPokemonType.cardTypes.includes(CardType.DARK)) {
          effect.damage += 20;
        }
              
        return state;
      }
    }
          
    return state; 
  }
        
}