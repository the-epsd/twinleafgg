import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_DOES_LESS_DAMAGE_AFTER_WEAKNESS_AND_RESISTANCE } from '../../game/store/prefabs/effect-of-attack-prefabs';

export class RotasMimeJr2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 50;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Barrier Attack',
    cost: [P, C],
    damage: 20,
    text: 'Damage done to Rota\'s Mime Jr.by your opponent\'s next attack is reduced by 30 (after applying Weakness and Resistance).'
  }];

  public set: string = 'PCGP';
  public name: string = 'Rota\'s Mime Jr.';
  public fullName: string = 'Rota\'s Mime Jr. PCGP 97';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '97';

  public readonly BARRIER_ATTACK_MARKER = 'BARRIER_ATTACK_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_DOES_LESS_DAMAGE_AFTER_WEAKNESS_AND_RESISTANCE(store, state, effect, this, 30);
    }

    return state;
  }
}
