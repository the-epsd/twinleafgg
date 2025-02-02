import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { GameMessage } from '../../game';

export class Beedrill extends PokemonCard {

  public set = 'BS';

  public name = 'Beedrill';

  public fullName = 'Beedrill BS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '17';

  public stage: Stage = Stage.STAGE_2;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 80;

  public evolvesFrom = 'Kakuna';

  public weakness = [{
    type: CardType.FIRE
  }];

  public resistance = [{
    type: CardType.FIGHTING,
    value: -30
  }];

  public attacks: Attack[] = [
    {
      name: 'Twineedle',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      text: 'Flip 2 coins. This attack does 30 damage times the number of heads.'
    },
    {
      name: 'Poison Sting',
      cost: [CardType.GRASS, CardType.GRASS, CardType.GRASS],
      damage: 40,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      return store.prompt(state, [
        new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP)
      ], (results) => {
        const heads = results.filter(r => !!r).length;
        effect.damage = 30 * heads;
      });

    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      return store.prompt(state, new CoinFlipPrompt(
        effect.player.id, GameMessage.COIN_FLIP
      ), (heads) => {
        if (heads) {
          const conditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
          store.reduceEffect(state, conditionEffect);
        }
      });

    }

    return state;

  }

}