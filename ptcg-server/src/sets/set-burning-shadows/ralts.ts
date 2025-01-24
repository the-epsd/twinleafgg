import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { HealTargetEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';

// BUS Ralts 91 (https://limitlesstcg.com/cards/BUS/91)
export class Ralts extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FAIRY;
  public hp: number = 60;
  public weakness = [{ type: CardType.METAL }];
  public resistance = [{ type: CardType.DARK, value: -20 }];
  public retreat = [CardType.COLORLESS];
  public attacks = [
    { name: 'Draining Kiss', cost: [CardType.FAIRY], damage: 10, text: 'Heal 10 damage from this Pokemon.' }
  ];
  public set: string = 'BUS';
  public setNumber: string = '91';
  public name: string = 'Ralts';
  public fullName: string = 'Ralts BUS';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const healTargetEffect = new HealTargetEffect(effect, 10);
      healTargetEffect.target = player.active;
      state = store.reduceEffect(state, healTargetEffect);
    }

    return state;
  }

}