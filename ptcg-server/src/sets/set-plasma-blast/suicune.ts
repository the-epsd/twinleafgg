import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State } from '../../game';
import { GamePhase } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Suicune extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 100;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public powers = [{
    name: 'Safeguard',
    powerType: PowerType.ABILITY,
    text: 'Prevent all effects of attacks, including damage, done to this Pokémon by Pokémon-EX.'
  }];

  public attacks = [{ name: 'Aurora Beam', cost: [W, C, C], damage: 70, text: '' }];

  public set: string = 'PLB';
  public setNumber = '20';
  public cardImage = 'assets/cardback.png';
  public name: string = 'Suicune';
  public fullName: string = 'Suicune PLB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();
      const sourceCard = effect.source.getPokemonCard();

      // Card is not active, or damage source is unknown
      if (pokemonCard !== this || sourceCard === undefined)
        return state;

      const player = StateUtils.findOwner(state, effect.target);
      if (state.phase !== GamePhase.ATTACK)
        return state;

      if (sourceCard.tags.includes(CardTag.POKEMON_EX) && !IS_ABILITY_BLOCKED(store, state, player, this))
        effect.preventDefault = true;
    }

    return state;
  }
}