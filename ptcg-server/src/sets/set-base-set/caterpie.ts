import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, SpecialCondition } from '../../game/store/card/card-types';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { GameMessage } from '../../game';

export class Caterpie extends PokemonCard {

  public stage = Stage.BASIC;
  public cardType = G;
  public hp = 40;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [
    {
      name: 'String Shot',
      cost: [G],
      damage: 10,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    }
  ];

  public set = 'BS';
  public setNumber = '45';
  public cardImage: string = 'assets/cardback.png';
  public name = 'Caterpie';
  public fullName = 'Caterpie BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return store.prompt(state, new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP), (heads) => {
        if (heads) {
          const condition = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, condition);
        }
      });
    }
    return state;
  }

}
