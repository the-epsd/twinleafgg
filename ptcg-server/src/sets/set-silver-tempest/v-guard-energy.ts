import { CardTag, CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { StoreLike } from '../../game/store/store-like';
import { State, GamePhase } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { IS_SPECIAL_ENERGY_BLOCKED } from '../../game/store/prefabs/prefabs';


export class VGuardEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public regulationMark = 'F';

  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '169';

  public name = 'V Guard Energy';

  public fullName = 'V Guard Energy SIT';

  public text =
    'As long as this card is attached to a Pokémon, it provides [C] Energy.' +
    '\n' +
    'The Pokémon this card is attached to takes 30 less damage from attacks from your opponent\'s Pokémon V (after applying Weakness and Resistance). This effect can\'t be applied more than once at a time to the same Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Reduce damage by 30
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      const player = StateUtils.findOwner(state, effect.target);

      if (IS_SPECIAL_ENERGY_BLOCKED(store, state, player, this, effect.target)) {
        return state;
      }

      const sourceCard = effect.source.getPokemonCard();
      if (sourceCard?.tags.includes(CardTag.POKEMON_V || CardTag.POKEMON_VMAX || CardTag.POKEMON_VSTAR)) {

        // Check if damage target is owned by this card's owner 
        const targetPlayer = StateUtils.findOwner(state, effect.target);
        if (targetPlayer === player) {
          effect.reduceDamage(30, this.name);
        }

        return state;
      }
      return state;
    }
    return state;
  }
}

