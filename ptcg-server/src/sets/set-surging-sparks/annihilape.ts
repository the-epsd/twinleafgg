import { Attack, CardType, PokemonCard, SpecialCondition, Stage, State, StateUtils, StoreLike, Weakness } from '../../game';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Annihilape extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Primeape';
  public cardType: CardType = F;
  public hp: number = 140;
  public weakness: Weakness[] = [{ type: P }];
  public retreat: CardType[] = [C, C];

  public attacks: Attack[] = [
    { name: 'Tantrum', cost: [F], damage: 130, text: 'This Pokémon is now Confused.' },
    { name: 'Destined Fight', cost: [F, C], damage: 0, text: 'Both Active Pokémon are Knocked Out.' },
  ];

  public set: string = 'SSP';
  public regulationMark: string = 'H';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '100';
  public name: string = 'Annihilape';
  public fullName: string = 'Annihilape SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      specialCondition.target = player.active;
      return store.reduceEffect(state, specialCondition);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Knock out both active Pokemon, the dumb way.
      player.active.damage += 999;
      opponent.active.damage += 999;
    }

    return state;
  }
}