import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Hoppip extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 40;
  public weakness = [{ type: CardType.FIRE }];
  
  public attacks = [{
    name: 'Continuous Spin',
    cost: [CardType.GRASS],
    damage: 20,
    text: 'Flip a coin until you get tails. This attack does 20 damage for each heads.'
  }];

  public set: string = 'EVS';
  public regulationMark: string = 'E';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '2';
  public name: string = 'Hoppip';
  public fullName: string = 'Hoppip EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const generator = flipGenerator(() => generator.next(), store, state, effect, 0);
      let result = generator.next().value;
      
      effect.damage = result[1] * 20;
      return result[0];
    }

    return state;
  }
}

// still a WIP
function* flipGenerator(next: Function, store: StoreLike, state: State, effect: AttackEffect, numberOfHeads: number): IterableIterator<State> {
  yield store.prompt(state, [
    new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP)
  ], result => {
    if (result) {
      numberOfHeads++;
      next(next, store, state, effect, numberOfHeads);
    } else {
      return [state, numberOfHeads];
    }
  });          
}