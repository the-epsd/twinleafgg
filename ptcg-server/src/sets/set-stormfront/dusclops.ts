import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { StoreLike, State, StateUtils } from '../../game';
import { Stage, CardType } from '../../game/store/card/card-types';
import { WAS_ATTACK_USED, AFTER_ATTACK, COIN_FLIP_PROMPT, ADD_CONFUSION_TO_PLAYER_ACTIVE, HEAL_X_DAMAGE_FROM_THIS_POKEMON } from '../../game/store/prefabs/prefabs';

export class Dusclops extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Duskull';
  public cardType: CardType = P;
  public hp: number = 80;
  public weakness = [{ type: D, value: +20 }];
  public resistance = [{ type: C, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Confuse Ray',
    cost: [P, C],
    damage: 20,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
  },
  {
    name: 'Trick Room',
    cost: [P, C, C],
    damage: 40,
    damageCalculation: '+',
    text: 'If you have a Stadium card in play, this attack does 40 damage plus 20 more damage. If your opponent has a Stadium card in play, remove 2 damage counters from Dusclops.'
  }];

  public set: string = 'SF';
  public name: string = 'Dusclops';
  public fullName: string = 'Dusclops SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '35';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const stadiumCard = StateUtils.getStadiumCard(state);

      if (stadiumCard === undefined) {
        return state;
      }
      const cardList = StateUtils.findCardList(state, stadiumCard);
      const stadiumOwner = StateUtils.findOwner(state, cardList);

      if (stadiumOwner === effect.player) {
        effect.damage += 20;
      } else {
        HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 20);
      }
    }

    return state;
  }

}