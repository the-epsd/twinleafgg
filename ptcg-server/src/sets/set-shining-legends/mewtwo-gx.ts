import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { BLOCK_IF_GX_ATTACK_USED, HEAL_X_DAMAGE_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS } from '../../game/store/prefabs/attack-effects';

export class MewtwoGX extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags: string[] = [CardTag.POKEMON_GX];
  public cardType: CardType = P;
  public hp: number = 190;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Full Burst',
    cost: [P],
    damage: 30,
    damageCalculation: 'x',
    text: 'This attack does 30 damage times the amount of Energy attached to this Pokémon.'
  },
  {
    name: 'Super Absorption',
    cost: [P, C],
    damage: 60,
    text: 'Heal 30 damage from this Pokémon.'
  },
  {
    name: 'Psystrike-GX',
    cost: [P, P, P],
    damage: 200,
    shredAttack: true,
    text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon. (You can\'t use more than 1 GX attack in a game.)'
  }];

  public set: string = 'SLG';
  public setNumber = '39';
  public cardImage = 'assets/cardback.png';
  public name: string = 'Mewtwo-GX';
  public fullName: string = 'Mewtwo-GX SLG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const playerProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, playerProvidedEnergy);
      const playerEnergyCount = playerProvidedEnergy.energyMap
        .reduce((left, p) => left + p.provides.length, 0);

      effect.damage = playerEnergyCount * 30;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 30);
    }

    if (WAS_ATTACK_USED(effect, 2, this)) {
      const player = effect.player;

      // Check if player has used GX attack
      BLOCK_IF_GX_ATTACK_USED(player);
      // set GX attack as used for game
      player.usedGX = true;

      THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS(store, state, effect, 200);
    }

    return state;
  }

}
