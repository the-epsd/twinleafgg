import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AttackEffect } from '../../../game/store/effects/game-effects';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { COPY_OPPONENT_ACTIVE_ATTACK_WITH_RETRY } from '../../../game/store/prefabs/copy-attack-prefabs';
import { BLOCK_RETREAT } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class EthansSudowoodo extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.ETHANS];
  public cardType: CardType[] = [F];
  public hp: number = 110;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Impound',
    cost: [F],
    damage: 20,
    text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
  }, {
    name: 'Try to Imitate',
    cost: [C, C],
    damage: 0,
    copycatAttack: true,
    text: 'Flip a coin. If heads, choose 1 of your opponent\'s Active Pokémon\'s attacks and use it as this attack.'
  }];

  public regulationMark = 'I';
  public set: string = 'DRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '93';
  public name: string = 'Ethan\'s Sudowoodo';
  public fullName: string = 'Ethan\'s Sudowoodo DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Impound
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    // Try to Imitate
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          COPY_OPPONENT_ACTIVE_ATTACK_WITH_RETRY(store, state, effect as AttackEffect);
        }
      });
    }

    return state;
  }
}
