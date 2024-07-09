import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, TrainerCard, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';

export class CastformRainyForm extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public regulationMark = 'E';
  public cardType: CardType = CardType.WATER;
  public hp = 70;
  public weakness = [{ type: CardType.LIGHTNING }];
  public resistance = [];
  public retreat = [];

  public powers = [
    {
      name: 'Weather Reading',
      text: 'If you have 8 or more Stadium cards in your discard pile, ignore all Energy in this Pokémon\'s attack costs.',
      powerType: PowerType.ABILITY,
      useWhenInPlay: false,
    }
  ];

  public attacks = [{
    name: 'Rainfall',
    cost: [CardType.WATER, CardType.COLORLESS],
    damage: 0,
    text: 'This attack does 20 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'CRE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '33';
  public name: string = 'Castform Rainy Form';
  public fullName: string = 'Castform Rainy Form CRE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckAttackCostEffect) {
      const player = effect.player;
      console.log('Number of stadiums in discard pile: ' + player.discard.cards.filter(c => c instanceof TrainerCard && (<TrainerCard>c).trainerType === TrainerType.STADIUM).length);

      if (player.discard.cards.filter(c => c instanceof TrainerCard && (<TrainerCard>c).trainerType === TrainerType.STADIUM).length >= 8) {
        try {
          const stub = new PowerEffect(player, {
            name: 'test',
            powerType: PowerType.ABILITY,
            text: ''
          }, this);
          store.reduceEffect(state, stub);
        } catch {
          return state;
        }

        this.attacks.forEach(attack => {
          attack.cost = [];
        });
        return state;
      } else {
        return state;
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const opponent = effect.opponent;
      const benched = opponent.bench.filter(b => b.cards.length > 0);

      const activeDamageEffect = new DealDamageEffect(effect, 20);
      store.reduceEffect(state, activeDamageEffect);

      benched.forEach(target => {
        const damageEffect = new PutDamageEffect(effect, 20);
        damageEffect.target = target;
        store.reduceEffect(state, damageEffect);
      });
    }

    return state;
  }
}