import { PlayerType, State, StoreLike } from '../../../game';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { BREAK_RULE, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PutCountersEffect } from '../../../game/store/effects/attack-effects';

export class TrevenantBREAK extends PokemonCard {
  public stage: Stage = Stage.BREAK;
  public tags = [CardTag.BREAK];
  public evolvesFrom = 'Trevenant';
  public cardType: CardType = P;
  public hp: number = 160;

  public attacks = [
    {
      name: 'Silent Fear',
      cost: [P, C],
      damage: 0,
      text: "Put 3 damage counters on each of your opponent's Pokémon.",
    },
  ];

  public set: string = 'BKP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '66';
  public name: string = 'Trevenant BREAK';
  public fullName: string = 'Trevenant BREAK BKP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Silent Fear
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;

      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (card) => {
        const damage = new PutCountersEffect(effect, 30);
        damage.target = card;
        store.reduceEffect(state, damage);
      });
    }

    BREAK_RULE(effect, state, this);

    return state;
  }
}
