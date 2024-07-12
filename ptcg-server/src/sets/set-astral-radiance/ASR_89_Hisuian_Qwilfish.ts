import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class HisuianQwilfish extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.DARK;
  public hp: number = 80;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Spiny Rush',
    cost: [],
    damage: 10,
    text: 'Flip a coin until you get tails. This attack does 10 damage for each heads. '
  }];

  public set: string = 'ASR';
  public setNumber: string = '89';
  public regulationMark: string = 'F';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Hisuian Qwilfish';
  public fullName: string = 'Hisuian Qwilfish ASR';

  public COIN_FLIP_TAILS: boolean = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, new CoinFlipPrompt(
        player.id,
        GameMessage.COIN_FLIP
      ), results => {
        let numFlips = 0;
        if (results === true) {
          numFlips++;
          while (!this.COIN_FLIP_TAILS) {
            store.prompt(state, [
              new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
            ], result => {
              if (result === true) {
                numFlips++;
              }
              else {
                this.COIN_FLIP_TAILS = true;
              }
            });

            if (this.COIN_FLIP_TAILS) {
              break;
            }
          }
        }

        effect.damage = 10 * numFlips;
      });

    }

    return state;
  }
}