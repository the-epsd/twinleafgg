import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckSpecialConditionRemovalEffect } from '../../../game/store/effects/check-effects';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from '../../../game/store/prefabs/attack-effects';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Toxicroak extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Croagunk';
  public hp: number = 90;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C];

  public powers = [{
    name: 'Poison Sacs',
    powerType: PowerType.POKEBODY,
    text: 'Your opponent can\'t remove the Special Condition Poisoned by evolving or devolving his or her Poisoned Pokémon. (This also includes putting a Pokémon Level-Up card onto the Poisoned Pokémon.)'
  }];

  public attacks = [{
    name: 'Knuckle Claws',
    cost: [P, C],
    damage: 30,
    text: 'The Defending Pokémon is now Poisoned.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '36';
  public name: string = 'Toxicroak';
  public fullName: string = 'Toxicroak MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Poison Sacs
    if (effect instanceof CheckSpecialConditionRemovalEffect) {
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (!StateUtils.isPokemonInPlay(owner, this)) {
        return state;
      }

      if (IS_POKEBODY_BLOCKED(store, state, owner, this)) {
        return state;
      }

      const opponent = StateUtils.getOpponent(state, owner);
      const isOpponentPokemon =
        opponent.active === effect.target ||
        opponent.bench.includes(effect.target);

      if (isOpponentPokemon && effect.target.specialConditions.includes(SpecialCondition.POISONED)) {
        if (!effect.preservedConditions.includes(SpecialCondition.POISONED)) {
          effect.preservedConditions.push(SpecialCondition.POISONED);
        }
      }
    }

    // Knuckle Claws
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
    }

    return state;
  }
}
