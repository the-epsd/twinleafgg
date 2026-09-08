import { PokemonCard, State, StoreLike } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { AttackEffect } from '../../../game/store/effects/game-effects';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';
import { COPY_OPPONENT_ACTIVE_ATTACK_WITH_RETRY } from '../../../game/store/prefabs/copy-attack-prefabs';

export class Clefairy extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public regulationMark = 'D';
  public cardType: CardType[] = [P];
  public weakness = [{ type: M }];
  public hp: number = 60;
  public retreat = [C];

  public attacks = [{
    name: 'Pound',
    cost: [P],
    damage: 10,
    text: ''
  }, {
    name: 'Mini-Metronome',
    cost: [C, C],
    damage: 0,
    copycatAttack: true,
    text: 'Flip a coin. If heads, choose 1 of your opponent\'s Active Pokémon\'s attacks and use it as this attack.'
  }];

  public set: string = 'VIV';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '63';
  public name: string = 'Clefairy';
  public fullName: string = 'Clefairy VIV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result === true) {
          return COPY_OPPONENT_ACTIVE_ATTACK_WITH_RETRY(store, state, effect as AttackEffect);
        }
      });
    }

    return state;
  }

}
