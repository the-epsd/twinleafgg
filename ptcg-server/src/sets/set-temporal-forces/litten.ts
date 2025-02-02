import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class Litten extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 60;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    { name: 'Fake Out', cost: [CardType.FIRE], damage: 10, text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed. ' }
  ];

  public set: string = 'TEF';

  public setNumber = '32';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'H';

  public name: string = 'Litten';

  public fullName: string = 'Litten TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]){
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result) {
          const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          return store.reduceEffect(state, specialCondition);
        }
      });
    }

    return state;
  }

}
