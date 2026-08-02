import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, NEXT_TURN_ATTACK_BONUS_ALL_ATTACKS, THIS_POKEMON_CANNOT_USE_THIS_ATTACK_NEXT_TURN } from '../../../game/store/prefabs/prefabs';

export class Serperior extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Servine';
  public cardType: CardType = G;
  public hp: number = 140;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Coil',
    cost: [C],
    damage: 40,
    text: 'During your next turn, this Pokémon\'s attacks do 60 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
  },
  {
    name: 'Slashing Strike',
    cost: [G],
    damage: 80,
    text: 'This Pokémon can\'t use Slashing Strike during your next turn.'
  }];

  public set: string = 'FCO';
  public setNumber: string = '7';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Serperior';
  public fullName: string = 'Serperior FCO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Coil
    if (WAS_ATTACK_USED(effect, 0, this)) {
      NEXT_TURN_ATTACK_BONUS_ALL_ATTACKS(effect, { source: this, bonusDamage: 60 });
    }

    // Slashing Strike
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_CANNOT_USE_THIS_ATTACK_NEXT_TURN(effect.player, effect.attack);
    }

    return state;
  }
}
