import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';

export class Haunter extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Gastly';
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [ C ];

  public attacks = [
    {
      name: 'Pain Amplifier',
      cost: [ P ],
      damage: 0,
      text: 'Put 2 damage counters on each of your opponent\'s Pokémon that has any damage counters on it.'
    }
  ];

  public set: string = 'CIN';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '37';
  public name: string = 'Haunter';
  public fullName: string = 'Haunter CIN';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)){
      const opponent = effect.opponent;

      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.damage > 0){
          const damage = new PutCountersEffect(effect, 20);
          damage.target = cardList;
          store.reduceEffect(state, damage);
        }
      });
    }

    return state;
  }
}