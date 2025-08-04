import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Zweilous extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Deino';
  public cardType = D;
  public hp: number = 110;
  public weakness = [{ type: G }];
  public resistance = [];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Double Hit',
    cost: [C, C],
    damage: 40,
    damageCalculation: 'x',
    text: 'Flip 2 coins. This attack does 40 damage for each heads.'
  },
  {
    name: 'Pitch-Black Fangs',
    cost: [D, D, C, C],
    damage: 100,
    text: ''
  }];

  public set: string = 'WHT';
  public regulationMark: string = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '66';
  public name: string = 'Zweilous';
  public fullName: string = 'Zweilous SV11W';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
      ], results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage = 40 * heads;
      });
    }
    return state;
  }
}