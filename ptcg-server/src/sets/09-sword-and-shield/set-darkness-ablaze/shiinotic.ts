import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  WAS_ATTACK_USED,
  COIN_FLIP_PROMPT,
  DEFENDING_POKEMON_CANNOT_ATTACK,
} from '../../../game/store/prefabs/prefabs';

export class Shiinotic extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Morelull';
  public cardType: CardType = P;
  public hp: number = 110;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Flickering Light',
    cost: [C],
    damage: 30,
    text: 'Flip a coin. If heads, during your opponent\'s next turn, the Defending Pokémon can\'t attack.'
  }, {
    name: 'Fear the Forest',
    cost: [P, C],
    damage: 60,
    damageCalculation: '+',
    text: 'If Glimwood Tangle is in play, this attack does 60 more damage.'
  }];

  public regulationMark: string = 'D';

  public set: string = 'DAA';
  public setNumber: string = '80';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Shiinotic';
  public fullName: string = 'Shiinotic DAA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Flickering Light
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          DEFENDING_POKEMON_CANNOT_ATTACK(store, state, effect, this);
        }
      });
    }

    // Fear the Forest
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const stadiumCard = StateUtils.getStadiumCard(state);
      if (stadiumCard !== undefined && stadiumCard.name === 'Glimwood Tangle') {
        effect.damage += 60;
      }
    }

    return state;
  }
}
