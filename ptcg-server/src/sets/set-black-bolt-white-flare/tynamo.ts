import { PokemonCard, Stage, CardType, StoreLike, State } from '../../game';
import { HealTargetEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Tynamo extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 40;
  public weakness = [{ type: F }];
  public retreat = [];

  public attacks = [{
    name: 'Hold Still',
    cost: [C],
    damage: 0,
    text: 'Heal 10 damage from this Pokémon'
  }];

  public regulationMark = 'I';
  public set: string = 'BLK';
  public setNumber: string = '30';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Tynamo';
  public fullName: string = 'Tynamo SV11B';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const healEffect = new HealTargetEffect(effect, 10);
      healEffect.target = effect.player.active;
      store.reduceEffect(state, healEffect);
    }
    return state;
  }
}
