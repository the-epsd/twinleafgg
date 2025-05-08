import { PokemonCard, Stage, CardType, StoreLike, State, CardTag } from '../../game';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Zekromex extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = L;
  public hp: number = 230;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Slash',
    cost: [C, C],
    damage: 50,
    text: ''
  },
  {
    name: 'Voltage Burst',
    cost: [L, L, C],
    damage: 130,
    damageCalculation: '+',
    text: 'This attack does 50 more damage for each Prize card your opponent has taken. This Pokémon does 30 damage to itself.'
  }];

  public regulationMark = 'I';
  public set: string = 'SV11B';
  public setNumber: string = '37';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Zekrom ex';
  public fullName: string = 'Zekrom ex SV11B';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      const prizesTaken = 6 - opponent.getPrizeLeft();
      const additionalDamage = 50 * prizesTaken;

      // Apply additional damage based on prizes taken
      effect.damage += additionalDamage;

      // Apply self-damage
      const dealDamage = new DealDamageEffect(effect, 30);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }
    return state;
  }
}
