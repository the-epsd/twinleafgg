import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { ADD_POISON_TO_PLAYER_ACTIVE, AFTER_ATTACK } from '../../game/store/prefabs/prefabs';

export class Bayleef extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Chikorita';
  public tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Poisonpowder',
    cost: [F, C],
    damage: 20,
    text: 'The Defending Pokémon is now Poisoned.'
  }];

  public set: string = 'DF';
  public name: string = 'Bayleef';
  public fullName: string = 'Bayleef DF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '26';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }

}
