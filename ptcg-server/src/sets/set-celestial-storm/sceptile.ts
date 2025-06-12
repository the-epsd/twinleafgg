import { State, StateUtils, StoreLike } from '../../game';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PowerType } from '../../game/store/card/pokemon-types';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { GET_TOTAL_ENERGY_ATTACHED_TO_PLAYERS_POKEMON, IS_ABILITY_BLOCKED, PREVENT_DAMAGE_IF_SOURCE_HAS_TAG, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Sceptile extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Grovyle';
  public cardType: CardType = CardType.GRASS;
  public hp: number = 140;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Power of Nature',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Prevent all damage done to your Pokémon that have any [G] Energy attached to them by attacks from your opponent\'s Ultra Beasts.'
  }];

  public attacks = [{
    name: 'Powerful Storm',
    cost: [CardType.GRASS],
    damage: 20,
    damageCalculation: 'x',
    text: 'This attack does 20 damage times the amount of Energy attached to all of your Pokémon.'
  }];

  public set: string = 'CES';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '10';
  public name: string = 'Sceptile';
  public fullName: string = 'Sceptile CES';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && effect.source.getPokemonCard() != null) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      
      if (IS_ABILITY_BLOCKED(store, state, opponent, this)) {
        return state;
      }
      
      PREVENT_DAMAGE_IF_SOURCE_HAS_TAG(effect, CardTag.ULTRA_BEAST, effect.source.getPokemonCard()!);
      return state;
    }
    
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const attachedEnergy = GET_TOTAL_ENERGY_ATTACHED_TO_PLAYERS_POKEMON(effect.player, store, state);
      effect.damage = 20 * attachedEnergy;
    }
    
    return state;
  }
}