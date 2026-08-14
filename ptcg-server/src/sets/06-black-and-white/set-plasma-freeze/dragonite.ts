import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON } from '../../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { OPPONENT_CANNOT_PLAY_ITEM_CARDS } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Dragonite extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Dragonair';
  public cardType: CardType = N;
  public hp: number = 150;
  public weakness = [{ type: N }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Deafen',
    cost: [C, C, C],
    damage: 60,
    text: 'Your opponent can\'t play any Item cards from his or her hand during his or her next turn.',
  },
  {
    name: 'Healwing',
    cost: [G, L, C, C],
    damage: 90,
    text: 'Heal 30 damage from this Pokémon.',
  }];

  public set: string = 'PLF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '83';
  public name: string = 'Dragonite';
  public fullName: string = 'Dragonite PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack Deafen
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENT_CANNOT_PLAY_ITEM_CARDS(store, state, effect, this);
    }

    // Attack Healwing
    if (WAS_ATTACK_USED(effect, 1, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(30, effect, store, state);
    }

    return state;
  }
}
