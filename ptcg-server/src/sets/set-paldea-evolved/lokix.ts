import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PokemonCardList, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Lokix extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 120;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS];
  public evolvesFrom = 'Nymble';

  public attacks = [{
    name: 'Assaulting Kick',
    cost: [CardType.GRASS],
    damage: 30,
    damageCalculation: '+',
    text: ' If this Pokémon evolved from Nymble during this turn, this attack does 100 more damage. '
  },
  {
    name: 'Speed Attack',
    cost: [CardType.GRASS, CardType.COLORLESS],
    damage: 70,
    text: ''
  }];

  public set: string = 'PAL';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public fullName: string = 'Lokix PAL';
  public name: string = 'Lokix';
  public setNumber: string = '21';

  public evolvedFromNymble = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const cardList = StateUtils.findCardList(state, this);

      if (cardList instanceof PokemonCardList) {
        if (cardList.pokemonPlayedTurn === state.turn) {
          effect.damage += 100;
        }
      }

    }

    return state;
  }
}