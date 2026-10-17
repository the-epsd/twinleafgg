import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { PowerEffect } from '../../../game/store/effects/game-effects';
import { ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON, CONFIRMATION_PROMPT, IS_POKEBODY_BLOCKED, THIS_ATTACK_DOES_X_DAMAGE_TO_EACH_OF_YOUR_OPPONENTS_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Tyranitar extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Pupitar';
  public hp: number = 140;
  public cardType: CardType[] = [D];
  public weakness = [{ type: F, value: +30 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Darkness Drive',
    powerType: PowerType.POKEBODY,
    text: 'After your opponent\'s Pokémon uses a Poké-Power, you may search your discard pile for a basic Darkness Energy card and attach it to Tyranitar.'
  }];

  public attacks = [{
    name: 'Grind',
    cost: [C, C],
    damage: 20,
    damageCalculation: 'x',
    text: 'Does 20 damage times the amount of Energy attached to Tyranitar.'
  },
  {
    name: 'Spinning Tail',
    cost: [D, D, D, D, D],
    damage: 0,
    text: 'This attack does 30 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '30';
  public name: string = 'Tyranitar';
  public fullName: string = 'Tyranitar SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Darkness Drive
    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.POKEPOWER) {
      if (!effect.card.powers.includes(effect.power)) {
        return state;
      }
      const powerUser = effect.player;
      const owner = StateUtils.getOpponent(state, powerUser);
      if (!StateUtils.isPokemonInPlay(owner, this) || IS_POKEBODY_BLOCKED(store, state, owner, this)) {
        return state;
      }
      CONFIRMATION_PROMPT(store, state, owner, wantToAttach => {
        if (!wantToAttach) {
          return;
        }
        ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON(
          store,
          state,
          owner,
          1,
          CardType.DARK,
          {
            energyFilter: { energyType: EnergyType.BASIC },
            targetFilter: (_list, card) => card === this,
            min: 0,
            allowCancel: true,
          },
        );
      });
    }

    // Grind
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const cardList = player.active;
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, cardList);
      store.reduceEffect(state, checkProvidedEnergy);
      const energyCount = checkProvidedEnergy.energyMap.reduce((sum, em) => sum + em.provides.length, 0);
      effect.damage = 20 * energyCount;
    }

    // Spinning Tail
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_EACH_OF_YOUR_OPPONENTS_POKEMON(30, effect, store, state);
    }

    return state;
  }
}
