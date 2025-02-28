import { Attack, CardType, PokemonCard, SpecialCondition, Stage, State, StateUtils, StoreLike, Weakness } from '../../game';
import { AddSpecialConditionsEffect, HealTargetEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Slowpoke extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness: Weakness[] = [{ type: L }];
  public retreat: CardType[] = [C, C];

  public attacks: Attack[] = [
    {
      name: 'Rest',
      cost: [C],
      damage: 0,
      text: 'This Pokémon is now Asleep. Heal 30 damage from it.',
    },
    { name: 'Headbutt', cost: [W, C], damage: 20, text: '' },
  ];

  public set: string = 'SVI';
  public regulationMark: string = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '42';
  public name: string = 'Slowpoke';
  public fullName: string = 'Slowpoke SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const cardList = StateUtils.findCardList(state, this);
      if (cardList !== effect.source) {
        return state;
      }

      const sleepEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      sleepEffect.target = effect.player.active;

      const healEffect = new HealTargetEffect(effect, 30);
      healEffect.target = effect.player.active;

      state = store.reduceEffect(state, sleepEffect);
      state = store.reduceEffect(state, healEffect);
    }

    return state;
  }
}