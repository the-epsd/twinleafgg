/* eslint-disable indent */
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CardTag } from '../../game/store/card/card-types';
import { StateUtils } from '../../game';
import { ApplyWeaknessEffect, AfterDamageEffect } from '../../game/store/effects/attack-effects';

export class Koraidon extends PokemonCard {

  public tags = [CardTag.ANCIENT];

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 140;

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Primordial Beatdown',
      cost: [CardType.FIGHTING, CardType.COLORLESS],
      damage: 30,
      damageCalculator: 'x',
      text: 'This attack does 30 damage for each of your Ancient Pokémon in play.'
    },
    {
      name: 'Shred',
      cost: [CardType.FIRE, CardType.FIGHTING, CardType.COLORLESS],
      damage: 130,
      shred: true,
      text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
    }
  ];

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '119';

  public name: string = 'Koraidon';

  public fullName: string = 'Koraidon TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;

      let ancientPokemonCount = 0;

      if (player.active?.getPokemonCard()?.tags.includes(CardTag.ANCIENT)) {
        ancientPokemonCount++;
      }

      player.bench.forEach(benchSpot => {
        if (benchSpot.getPokemonCard()?.tags.includes(CardTag.ANCIENT)) {
          ancientPokemonCount++;
        }
      });

      effect.damage = 30 * ancientPokemonCount;

    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const applyWeakness = new ApplyWeaknessEffect(effect, 130);
      store.reduceEffect(state, applyWeakness);
      const damage = applyWeakness.damage;

      effect.damage = 0;

      if (damage > 0) {
        opponent.active.damage += damage;
        const afterDamage = new AfterDamageEffect(effect, damage);
        state = store.reduceEffect(state, afterDamage);
      }
    }
    return state;
  }
}
