import { PokemonCard, Stage, CardType, State, StoreLike, CoinFlipPrompt, GameMessage } from '../../game';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

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
  public set: string = 'WHT';
  public setNumber: string = '50';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Archen';
  public fullName: string = 'Archen SV11W';

  public reduceEffect(store: StoreLike, state: State, effect: any): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
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