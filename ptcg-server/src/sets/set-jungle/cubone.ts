import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_DOES_LESS_DAMAGE } from '../../game/store/prefabs/effect-of-attack-prefabs';

export class Cubone extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 40;
  public weakness = [{ type: G }];
  public resistance = [{ type: L, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Snivel',
    cost: [C],
    damage: 0,
    text: 'If the Defending Pokémon attacks Cubone during your opponent\'s next turn, any damage done by the attack is reduced by 20 (after applying Weakness and Resistance). (Benching either Pokémon ends this effect.)'
  },
  {
    name: 'Rage',
    cost: [F, F],
    damage: 10,
    text: 'Does 10 damage plus 10 more damage for each damage counter on Cubone.'
  }];

  public set: string = 'JU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '50';
  public name: string = 'Cubone';
  public fullName: string = 'Cubone JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Snivel
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_DOES_LESS_DAMAGE(store, state, effect, this, 20);
    }
    // Rage
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.damage += effect.player.active.damage * 10;
      return state;
    }

    return state;
  }
}
