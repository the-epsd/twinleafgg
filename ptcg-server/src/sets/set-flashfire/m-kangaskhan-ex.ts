import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { EvolveEffect } from '../../game/store/effects/game-effects';
import { CoinFlipPrompt, GameMessage, PlayerType } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MKangaskhanEX extends PokemonCard {
  public stage: Stage = Stage.MEGA;
  public tags = [CardTag.POKEMON_EX, CardTag.MEGA];
  public evolvesFrom = 'Kangaskhan-EX';
  public cardType: CardType = C;
  public hp: number = 230;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Wham Bam Punch',
    cost: [C, C, C],
    damage: 100,
    damageCalculation: '+',
    text: 'Flip a coin until you get tails. This attack does 30 more damage for each heads.'
  }];

  public set: string = 'FLF';
  public name: string = 'M Kangaskhan-EX';
  public fullName: string = 'M Kangaskhan-EX FLF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '79';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if ((effect instanceof EvolveEffect) && effect.pokemonCard === this) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this && cardList.tools.length > 0 && cardList.tools[0].name === 'Kangaskhan Spirit Link') {
          return state;
        } else {
          const endTurnEffect = new EndTurnEffect(player);
          store.reduceEffect(state, endTurnEffect);
          return state;
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const flipCoin = (heads: number = 0): State => {
        return store.prompt(state, [
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
        ], result => {
          if (result === true) {
            return flipCoin(heads + 1);
          }
          effect.damage += 30 * heads;
          return state;
        });
      };
      return flipCoin();
    }

    return state;
  }

}
