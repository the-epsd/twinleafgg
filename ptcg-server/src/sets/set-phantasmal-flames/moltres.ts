import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Moltres extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 120;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Fighting Wings',
    cost: [R],
    damage: 20,
    damageCalculation: '+',
    text: 'If your opponent\'s Active Pokémon is a Pokemon ex, this attack does 90 more damage.'
  }];

  public regulationMark = 'I';
  public set: string = 'PFL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '14';
  public name: string = 'Moltres';
  public fullName: string = 'Moltres M2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentActive = opponent.active.getPokemonCard();
      if (opponentActive && opponentActive.tags.includes(CardTag.POKEMON_ex)) {
        effect.damage += 90;
      }
    }
    return state;
  }
}