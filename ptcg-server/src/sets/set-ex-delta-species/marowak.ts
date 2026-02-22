import { State, StoreLike } from '../../game';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckPokemonTypeEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Marowak extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Cubone';
  public tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType = F;
  public additionalCardTypes = [M];
  public hp: number = 80;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Energy Bone',
    cost: [F, M],
    damage: 0,
    text: 'Choose a number of your opponent\'s Pokémon up to the amount of Energy attached to Marowak. This attack does 20 damage to each of them.'
  },
  {
    name: 'Metal Crusher',
    cost: [F, C, C],
    damage: 50,
    text: 'If the Defending Pokémon is [M] Pokémon, this attack\'s base damage is 90.'
  }];

  public set: string = 'DS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '10';
  public name: string = 'Marowak';
  public fullName: string = 'Marowak DS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const cardList = player.active;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, cardList);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energies: number = 0;
      checkProvidedEnergyEffect.energyMap.forEach(energy => { energy.provides.forEach(e => { energies++; }); });

      THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON(20, effect, store, state, 0, energies);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const checkPokemonTypeEffect = new CheckPokemonTypeEffect(effect.opponent.active);
      store.reduceEffect(state, checkPokemonTypeEffect);

      if (checkPokemonTypeEffect.cardTypes.includes(CardType.METAL)) {
        effect.damage = 90;
      }
    }

    return state;
  }
}