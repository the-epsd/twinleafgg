import { PokemonCard, Stage, CardType } from '../../game';
import { StoreLike, State, GameMessage, CoinFlipPrompt } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { SpecialCondition } from '../../game/store/card/card-types';

export class Growlithe extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 50;
  public retreat = [C];
  public weakness = [{ type: W }];
  public attacks = [
    {
      name: 'Body Slam',
      cost: [C],
      damage: 10,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
    {
      name: 'Firebreathing',
      cost: [R, C],
      damage: 10,
      damageCalculation: '+',
      text: 'Flip a coin. If heads, this attack does 10 damage plus 20 more damage.'
    }
  ];
  public set: string = 'LM';
  public name: string = 'Growlithe';
  public fullName: string = 'Growlithe LM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '55';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect) {
      if (effect.attack === this.attacks[0]) {
        const player = effect.player;
        return store.prompt(state, [
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
        ], result => {
          if (result === true) {
            const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
            store.reduceEffect(state, specialConditionEffect);
          }
        });
      }

      if (effect.attack === this.attacks[1]) {
        const player = effect.player;
        return store.prompt(state, [
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
        ], result => {
          if (result === true) {
            effect.damage += 20;
          }
        });
      }
    }
    return state;
  }
}
