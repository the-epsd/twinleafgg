import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State } from '../../game';
import { GamePhase } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class Hoopa extends PokemonCard {

  public tags = [ ];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 120;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Scoundrel Guard',  
    useWhenInPlay: false,
    powerType: PowerType.ABILITY,
    text: 'Prevent all effects of attacks, including damage, done to this Pokémon by your opponent\'s Pokémon-GX or Pokémon-EX.'
  }];

  public attacks = [
    {
      name: 'Super Psy Bolt',
      cost: [ CardType.DARK, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 80,
      text: ''
    }   
  ];

  public set: string = 'SLG';

  public setNumber = '55';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Hoopa';

  public fullName: string = 'Hoopa SLG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Scoundrel Guard
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();
      const sourceCard = effect.source.getPokemonCard();
  
      // Card is not active, or damage source is unknown
      if (pokemonCard !== this || sourceCard === undefined) {
        return state;
      }
  
      // Do not ignore self-damage from Pokemon-Ex
      const player = StateUtils.findOwner(state, effect.target);
      const opponent = StateUtils.findOwner(state, effect.source);
      if (player === opponent) {
        return state;
      }
  
      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }
  
      if (sourceCard.tags.includes(CardTag.POKEMON_EX) || sourceCard.tags.includes(CardTag.POKEMON_GX)) {
  
        // Try to reduce PowerEffect, to check if something is blocking our ability
        try {
          const powerEffect = new PowerEffect(player, this.powers[0], this);
          store.reduceEffect(state, powerEffect);
        } catch {
          return state;
        }
  
        effect.preventDefault = true;
      }
    }

    return state;
  }
}