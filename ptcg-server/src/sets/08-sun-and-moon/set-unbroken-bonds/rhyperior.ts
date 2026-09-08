import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_CANNOT_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Rhyperior extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Rhydon';
  public cardType: CardType[] = [F];
  public hp: number = 170;
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Hefty Cannon',
    cost: [F, C, C],
    damage: 90,
    text: 'If the Defending Pokémon is a Basic Pokémon, it can\'t attack during your opponent\'s next turn.'
  }, {
    name: 'Break Ground',
    cost: [F, C, C, C],
    damage: 160,
    text: 'This attack does 20 damage to each of your Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'UNB';
  public setNumber: string = '95';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Rhyperior';
  public fullName: string = 'Rhyperior UNB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Hefty Cannon
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (effect.opponent.active.getPokemonCard()?.stage === Stage.BASIC) {
        return DEFENDING_POKEMON_CANNOT_ATTACK(store, state, effect, this);
      }
    }

    // Break Ground
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.bench.forEach(benched => {
        if (benched.cards.length > 0) {
          const damage = new PutDamageEffect(effect, 20);
          damage.target = benched;
          store.reduceEffect(state, damage);
        }
      });
    }

    return state;
  }
}
