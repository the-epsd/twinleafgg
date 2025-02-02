import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { GameMessage } from '../../game/game-message';

export class Frogadier extends PokemonCard {

  public regulationMark = 'H';

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Froakie';

  public cardType: CardType = CardType.WATER;

  public hp: number = 90;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Numbing Water',
      cost: [CardType.WATER],
      damage: 20,
      text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
    }
  ];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '57';

  public name: string = 'Frogadier';

  public fullName: string = 'Frogadier TWM';

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