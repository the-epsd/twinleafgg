import { PokemonCard, Stage, CardType, StoreLike, State } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { HealEffect } from "../../game/store/effects/game-effects";
import { WAS_ATTACK_USED } from "../../game/store/prefabs/prefabs";

export class Espurr extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Nap',
    cost: [C],
    damage: 0,
    text: 'Heal 20 damage from this Pokemon.'
  },
  {
    name: 'Stampede',
    cost: [P],
    damage: 10,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '32';
  public name: string = 'Espurr';
  public fullName: string = 'Espurr M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Nap - heal 20 damage from this Pokemon
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const healEffect = new HealEffect(player, player.active, 20);
      store.reduceEffect(state, healEffect);
    }

    return state;
  }
}
