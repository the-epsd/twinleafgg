import { CardTag, CardType, PokemonCard, SpecialCondition, Stage, State, StateUtils, StoreLike } from "../../game";
import { AddSpecialConditionsEffect } from "../../game/store/effects/attack-effects";
import { Effect } from "../../game/store/effects/effect";
import { AttackEffect } from "../../game/store/effects/game-effects";

export class BruteBonnet extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.ANCIENT];
  public cardType: CardType = D;
  public hp: number = 120;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Poison Spray',
      cost: [D],
      damage: 0,
      text: 'Your opponent\'s Active Pokémon is now Poisoned.'
    },
    {
      name: 'Relentless Punches',
      cost: [D, D, D],
      damage: 50,
      damageCalculation: '+',
      text: 'This attack does 50 more damage for each damage counter on your opponent\'s Active Pokémon.'
    }
  ];

  public regulationMark: string = 'H';
  public set: string = 'TWM';
  public setNumber: string = '118';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Brute Bonnet';
  public fullName: string = 'Brute Bonnet TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      store.reduceEffect(state, specialCondition);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      if (opponent.active.damage > 0) {
        const damage = 50 + (opponent.active.damage * 5);
        effect.damage = damage;
      }
    }

    return state;
  }
}