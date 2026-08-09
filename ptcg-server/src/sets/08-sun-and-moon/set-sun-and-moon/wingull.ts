import { CardType, PokemonCard, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { BLOCK_SELF_RETREAT } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Wingull extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Roost',
    cost: [C],
    damage: 0,
    text: 'Heal 30 damage from this Pokémon. It can\'t retreat during your next turn.'
  }];

  public set: string = 'SUM';
  public setNumber: string = '37';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Wingull';
  public fullName: string = 'Wingull SUM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Roost — self can't retreat (not defending); BLOCK_RETREAT targets opponent
    if (WAS_ATTACK_USED(effect, 0, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 30);
      BLOCK_SELF_RETREAT(store, state, effect, this);
    }

    return state;
  }
}
