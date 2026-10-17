import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../../game/store/prefabs/attack-effects';
import { BLOCK_RETREAT } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { APPLY_SPECIAL_CONDITIONS_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Muk extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Grimer';
  public hp: number = 80;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Toxic Sludge',
    powerType: PowerType.POKEBODY,
    text: 'At the end of each player\'s turn, each of your opponent\'s Active Pokémon that has any Grass Energy attached to it is now Poisoned. If that Pokémon is already Poisoned, Toxic Sludge Poké-Body does nothing to that Pokémon.'
  }];

  public attacks = [{
    name: 'Panic Liquid',
    cost: [P, P, C],
    damage: 50,
    text: 'The Defending Pokémon is now Confused and can\'t retreat during your opponent\'s next turn.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '56';
  public name: string = 'Muk';
  public fullName: string = 'Muk SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Toxic Sludge
    if (effect instanceof EndTurnEffect) {
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (!StateUtils.isPokemonInPlay(owner, this)) {
        return state;
      }
      if (IS_POKEBODY_BLOCKED(store, state, owner, this)) {
        return state;
      }

      const opponent = StateUtils.getOpponent(state, owner);
      if (opponent.active.specialConditions.includes(SpecialCondition.POISONED)) {
        return state;
      }

      const checkEnergy = new CheckProvidedEnergyEffect(opponent, opponent.active);
      store.reduceEffect(state, checkEnergy);
      const hasGrass = checkEnergy.energyMap.some(em =>
        em.provides.includes(CardType.GRASS) || em.provides.includes(CardType.ANY)
      );

      if (hasGrass) {
        APPLY_SPECIAL_CONDITIONS_FROM_ABILITY(
          store,
          state,
          owner,
          this.powers[0],
          this,
          opponent.active,
          [SpecialCondition.POISONED],
        );
      }
    }

    // Panic Liquid
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
      return BLOCK_RETREAT(store, state, effect, this);
    }

    return state;
  }
}
