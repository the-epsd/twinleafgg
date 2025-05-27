import { PokemonCard, Stage, CardType, State, StoreLike, CoinFlipPrompt, GameMessage } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Archen extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Antique Plume Fossil';
  public cardType: CardType = F;
  public hp: number = 80;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Acrobatics',
      cost: [F, C],
      damage: 30,
      damageCalculation: '+',
      text: 'Flip 2 coins. This attack does 30 more damage for each heads.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'SV11W';
  public setNumber: string = '47';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Archen';
  public fullName: string = 'Archen SV11W';

  public reduceEffect(store: StoreLike, state: State, effect: any): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage += 30 * heads;
      });
    }
    return state;
  }
} 