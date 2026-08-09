import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_CANNOT_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../../game/store/prefabs/costs';

export class Mamoswine extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Piloswine';
  public cardType: CardType = W;
  public hp: number = 180;
  public weakness = [{ type: M }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Blizzard',
    cost: [W, C, C],
    damage: 80,
    text: 'This attack also does 10 damage to each of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }, {
    name: 'Iceberg Press',
    cost: [W, W, C, C],
    damage: 170,
    text: 'Discard an Energy from this Pokémon. During your opponent\'s next turn, the Defending Pokémon can\'t attack.'
  }];

  public regulationMark: string = 'F';
  public set: string = 'ASR';
  public setNumber: string = '33';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mamoswine';
  public fullName: string = 'Mamoswine ASR 33';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Blizzard
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.opponent.bench.forEach(benched => {
        if (benched.cards.length > 0) {
          const damage = new PutDamageEffect(effect, 10);
          damage.target = benched;
          store.reduceEffect(state, damage);
        }
      });
    }

    // Iceberg Press
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
      return DEFENDING_POKEMON_CANNOT_ATTACK(store, state, effect, this);
    }

    return state;
  }
}
