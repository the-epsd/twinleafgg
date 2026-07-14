import { CardType, PokemonCard, Stage, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DealDamageEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Frosmoth extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Snom';
  public cardType: CardType = W;
  public hp: number = 110;
  public weakness = [{ type: M }];
  public resistance = [];
  public retreat = [C, C];

  public attacks = [{
    name: 'Chilling Wings',
    cost: [W],
    damage: 0,
    text: 'This attack does 20 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) Your opponent\'s Active Pokémon is now Asleep.'
  }];

  public regulationMark = 'I';
  public set = 'MEG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber = '43';
  public name = 'Frosmoth';
  public fullName = 'Frosmoth MEG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Ref: set-unified-minds/noivern.ts (Boomburst), set-rebel-clash/toxtricity.ts (Poison Shout)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const dealDamage = new DealDamageEffect(effect, 20);
      dealDamage.target = opponent.active;
      store.reduceEffect(state, dealDamage);

      opponent.bench.forEach(benched => {
        if (benched.cards.length > 0) {
          const damage = new PutDamageEffect(effect, 20);
          damage.target = benched;
          store.reduceEffect(state, damage);
        }
      });
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
    }

    return state;
  }
}
