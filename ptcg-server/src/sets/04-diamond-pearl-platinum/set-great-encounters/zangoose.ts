import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PlayerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Zangoose extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Slash',
    cost: [C],
    damage: 20,
    text: ''
  },
  {
    name: 'Cutting Claw',
    cost: [C, C, C],
    damage: 40,
    damageCalculation: '+',
    text: 'If your opponent has Seviper in play, this attack does 40 damage plus 50 more damage.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '59';
  public name: string = 'Zangoose';
  public fullName: string = 'Zangoose GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Cutting Claw
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      let hasSeviper = false;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (_list, card) => {
        if (card.name === 'Seviper') {
          hasSeviper = true;
        }
      });
      if (hasSeviper) {
        effect.damage += 50;
      }
    }

    return state;
  }
}
