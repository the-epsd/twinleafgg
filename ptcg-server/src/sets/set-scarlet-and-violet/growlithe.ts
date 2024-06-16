import { PokemonCard, Stage, CardType, State, StoreLike, CoinFlipPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Growlithe extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType = CardType.FIRE;

  public hp = 70;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Relentless Flames',
      cost: [CardType.FIRE],
      damage: 30,
      text: 'Flip a coin until you get tails. This attack does 30 damage for each heads.'
    }
  ];

  public set: string = 'SVI';

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '30';

  public name: string = 'Growlithe';

  public fullName: string = 'Growlithe SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      let heads = 0;
    
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], (result: boolean[]) => {
        let flipResult = result[0];
        while (flipResult) {
          heads++;
          state = store.prompt(state, [
            new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
          ], (newResult: boolean[]) => {
            flipResult = newResult[0];
          });
        }
        effect.damage = heads * 30;
        return state;
      });
    }
    return state;
  }
}