import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike, TrainerCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { AfterDamageEffect, ApplyWeaknessEffect } from '../../game/store/effects/attack-effects';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';

export class Veluza extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 130;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [
    {
      name: 'Food Prep',
      useWhenInPlay: false,
      powerType: PowerType.ABILITY,
      text: 'Attacks used by this Pokémon cost [C] less for each Kofu card in your discard pile.'
    }
  ];

  public attacks = [
    {
      name: 'Sonic Edge',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 110,
      text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
    }
  ];

  public set: string = 'SCR';

  public name: string = 'Veluza';

  public fullName: string = 'Veluza SCR';

  public setNumber: string = '45';

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Food Prep
    if (effect instanceof CheckAttackCostEffect) {
      const player = effect.player;

      if (effect.player !== player || player.active.getPokemonCard() !== this) {
        return state;
      }

      // i love checking for ability lock woooo
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      let kofuCount = 0;
      player.discard.cards.forEach(c => {
        if (c instanceof TrainerCard && c.name === 'Kofu') {
          kofuCount += 1;
        }
      });
      const index = effect.cost.indexOf(CardType.COLORLESS);
      effect.cost.splice(index, kofuCount);

      return state;
    }


    // Sonic Edge
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const applyWeakness = new ApplyWeaknessEffect(effect, 110);
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