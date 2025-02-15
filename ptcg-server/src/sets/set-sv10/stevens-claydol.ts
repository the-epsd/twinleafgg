import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, DISCARD_ALL_ENERGY_FROM_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class StevensClaydol extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Steven\'s Baltoy';
  public tags = [CardTag.STEVENS];
  public cardType: CardType = P;
  public hp: number = 120;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Eerie Light',
    cost: [P],
    damage: 20,
    text: 'Your opponent\'s Active Pokémon is now Confused.'
  }, {
    name: 'Clay Blast',
    cost: [P, P, C],
    damage: 220,
    text: 'Discard all Energy from this Pokémon.'
  }];

  public regulationMark = 'I';
  public set: string = 'SVOD';
  public setNumber: string = '2';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Steven\'s Claydol';
  public fullName: string = 'Steven\'s Claydol SVOD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, this);
    }
    return state;
  }
}
