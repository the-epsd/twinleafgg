import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class Bayleef extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 90;
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public weakness = [{ type: CardType.FIRE }];
  public evolvesFrom: string = 'Chikorita';

  public attacks = [{
    name: 'Body Slam',
    cost: [CardType.COLORLESS],
    damage: 20,
    text: 'Flip a coin. If heads, your opponent\'s Active Pokemon is now Paralyzed'
  },
  {
    name: 'Vine Whip',
    cost: [CardType.GRASS, CardType.COLORLESS],
    damage: 30,
    text: ''
  }];

  public set: string = 'BKP';
  public name: string = 'Bayleef';
  public fullName: string = 'Bayleef BKP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
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
    return state;
  }
}