import { PokemonCard, Stage, CardType, StoreLike, State, CardTag } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Kyuremex extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = W;
  public hp: number = 230;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Slash',
    cost: [C, C],
    damage: 50,
    text: ''
  },
  {
    name: 'Freezing Flames',
    cost: [W, W, C],
    damage: 130,
    text: 'This attack does 10 damage to each of your opponent\'s Benched Pokémon for each Prize card your opponent has taken.'
  }];

  public regulationMark = 'I';
  public set: string = 'BLK';
  public setNumber: string = '28';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Kyurem ex';
  public fullName: string = 'Kyurem ex SV11B';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = effect.opponent;
      const benched = opponent.bench.filter(b => b.cards.length > 0);

      const prizesTaken = 6 - opponent.getPrizeLeft();
      const damagePerPrize = 10;

      benched.forEach(target => {
        const damageEffect = new PutDamageEffect(effect, (damagePerPrize * prizesTaken));
        damageEffect.target = target;
        store.reduceEffect(state, damageEffect);
      });
    }
    return state;
  }
}