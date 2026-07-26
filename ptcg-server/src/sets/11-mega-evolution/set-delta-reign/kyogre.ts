import { CardType, PokemonCard, Stage, State, StateUtils, StoreLike } from '../../../game';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Kyogre extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 150;
  public weakness = [{ type: L }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Waterfall',
    cost: [W, C],
    damage: 40,
    text: ''
  },
  {
    name: 'Savage Whirlpool',
    cost: [W, W, C],
    damage: 100,
    text: 'If there is a Stadium in play with "Legendary" in its name, this attack also does 50 damage to each of your opponent\'s Benched Pokemon.'
  }];

  public regulationMark: string = 'J';
  public set: string = 'M6';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '18';
  public name: string = 'Kyogre';
  public fullName: string = 'Kyogre M6';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Savage Whirlpool
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const stadium = StateUtils.getStadiumCard(state);

      if (stadium && stadium.name.includes('Legendary')) {
        const opponent = StateUtils.getOpponent(state, effect.player);

        opponent.bench.forEach(benched => {
          if (benched.cards.length > 0) {
            const damage = new PutDamageEffect(effect, 50);
            damage.target = benched;
            store.reduceEffect(state, damage);
          }
        });
      }
    }

    return state;
  }
}
