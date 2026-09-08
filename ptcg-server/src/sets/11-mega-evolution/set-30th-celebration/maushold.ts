import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State, PlayerType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT, DISCARD_TOP_X_OF_OPPONENTS_DECK } from '../../../game/store/prefabs/prefabs';

export class Maushold extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Tandemaus';
  public hp: number = 70;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Gnaw Together',
    cost: [C],
    damage: 0,
    text: 'Flip a coin for each Maushold you have in play. For each heads, discard the top 2 cards of your opponent\'s deck.'
  },
  {
    name: 'Pound',
    cost: [C],
    damage: 40,
    text: ''
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '125';
  public name: string = 'Maushold';
  public fullName: string = 'Maushold 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Gnaw Together
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      let mausholdCount = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_cardList, card) => {
        if (card.name === 'Maushold') {
          mausholdCount += 1;
        }
      });

      if (mausholdCount === 0) {
        return state;
      }

      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, mausholdCount, results => {
        const heads = results.filter(r => r).length;
        for (let i = 0; i < heads; i++) {
          DISCARD_TOP_X_OF_OPPONENTS_DECK(store, state, player, 2, this, effect);
        }
      });
    }

    return state;
  }
}
