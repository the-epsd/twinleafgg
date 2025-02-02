import { PokemonCard, Stage, CardType, StoreLike, State, GameMessage, CoinFlipPrompt, GameWinner, SpecialCondition } from '../../game';
import { endGame } from '../../game/store/effect-reducers/check-effect';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Slowbro extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public evolvesFrom: string = 'Slowpoke';

  public cardType: CardType = W;

  public hp: number = 120;

  public weakness = [{ type: G }];

  public retreat = [C, C];

  public attacks = [
    {
      name: 'Yawn',
      cost: [W],
      damage: 20,
      text: 'Your opponent\'s Active Pokémon is now Asleep.'
    },
    {
      name: 'Three Strikes',
      cost: [W, C, C],
      damage: 100,
      damageCalculation: 'x',
      text: 'Flip 3 coins. This attack does 100 damage for each heads. If all of them are tails, you lose this game.'
    }
  ];

  public set: string = 'UNB';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '43';

  public name: string = 'Slowbro';

  public fullName: string = 'Slowbro UNB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      state = store.reduceEffect(state, specialConditionEffect);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        let heads = 0;
        results.forEach(r => { heads += r ? 1 : 0; });

        if (heads === 0) {
          for (let i = 0; i < state.players.length; i++) {
            const currentPlayer = state.players[i];
            if (currentPlayer.id === player.id) {
              state.winner = currentPlayer.id === GameWinner.PLAYER_1 ? GameWinner.PLAYER_2 : GameWinner.PLAYER_1;
              state = endGame(store, state, state.winner);
              return;
            }
          }
        }
        effect.damage = heads * 100;
      });
    }
    return state;
  }
}