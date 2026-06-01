import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, CoinFlipPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class InkayLOR77 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: D }];
  public resistances = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Fickle Attack',
      cost: [P],
      damage: 30,
      text: 'Flip a coin. If tails, this attack does nothing.',
    },
  ];

  public set: string = 'LOR';
  public regulationMark: string = 'F';
  public fullName: string = 'Inkay LOR 77';
  public name: string = 'Inkay';
  public setNumber: string = '77';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-mega-evolution/scorbunny.ts
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      state = store.prompt(
        state,
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        (result) => {
          if (result === false) {
            // tails
            effect.damage = 0;
          }
        },
      );
    }

    return state;
  }
}
