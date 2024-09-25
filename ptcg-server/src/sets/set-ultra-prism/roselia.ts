import { CoinFlipPrompt, State, StoreLike } from '../../game';
import { GameMessage } from '../../game/game-message';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Roselia extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 70;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Petal Dance',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: 30,
      damageCalculation: 'x',
      text: 'Flip 3 coins. This attack does 30 damage for each heads. This Pokémon is now Confused.'
    }
  ];

  public set: string = 'UPR';

  public name: string = 'Roselia';

  public fullName: string = 'Roselia UPR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      state = store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        
        effect.damage = 30 * heads;
      });
      
      const addSpecialConditionsEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      addSpecialConditionsEffect.target = player.active;
      store.reduceEffect(state, addSpecialConditionsEffect);      
      
      return state;
    }

    return state;
  }

}
