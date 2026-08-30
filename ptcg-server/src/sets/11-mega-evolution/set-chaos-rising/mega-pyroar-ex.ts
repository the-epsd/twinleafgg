import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_DOES_LESS_DAMAGE } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class MegaPyroarex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Litleo';
  protected _tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public cardType: CardType[] = [R];
  public hp: number = 340;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Ferocious Bellow',
    cost: [R, C],
    damage: 80,
    text: 'During your opponent\'s next turn, attacks used by the Defending Pokémon do 50 less damage (before applying Weakness and Resistance).'
  },
  {
    name: 'Big Bang Fire',
    cost: [R, R, C],
    damage: 290,
    damageCalculation: '-',
    text: 'This attack does 10 less damage for each damage counter on this Pokémon.'
  }];

  public regulationMark = 'J';
  public set: string = 'CRI';
  public setNumber: string = '15';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mega Pyroar ex';
  public fullName: string = 'Mega Pyroar ex M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ferocious Bellow
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_DOES_LESS_DAMAGE(store, state, effect, this, 50);
    }

    // Big Bang Fire
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const damageCounters = Math.floor(player.active.damage / 10);
      effect.damage = Math.max(0, 290 - damageCounters * 10);
    }

    return state;
  }
}
