import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import {
  StoreLike, State, PlayerType,
  StateUtils
} from '../../game';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';


export class HisuianBraviary extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Rufflet';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 120;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Eerie Cry',
      cost: [],
      damage: 0,
      text: 'Put 3 damage counters on each of your opponent\'s Pokémon that has any damage counters on it.'
    },
    {
      name: 'Mind Bend',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 80,
      text: 'Your opponent\'s Active Pokémon is now Confused.'
    }
  ];

  public set: string = 'SIT';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '149';

  public name: string = 'Hisuian Braviary';

  public fullName: string = 'Hisuian Braviary SIT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (cardList.damage === 0) {
          return;
        }
        const damageEffect = new PutCountersEffect(effect, 30);
        damageEffect.target = cardList;
        store.reduceEffect(state, damageEffect);
      });

      if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
        const player = effect.player;
        const opponent = StateUtils.getOpponent(state, player);
        opponent.active.specialConditions.push(SpecialCondition.CONFUSED);
      }

      return state;
    }
    return state;
  }
}
