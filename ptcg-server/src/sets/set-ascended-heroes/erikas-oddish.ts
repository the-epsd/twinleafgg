import { PokemonCard, Stage, CardTag, CardType, StoreLike, State } from "../../game";
import { DealDamageEffect } from "../../game/store/effects/attack-effects";
import { Effect } from "../../game/store/effects/effect";
import { WAS_ATTACK_USED } from "../../game/store/prefabs/prefabs";

export class ErikasOddish extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.ERIKAS];
  public cardType: CardType = G;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Assault',
    cost: [G],
    damage: 30,
    text: 'This Pokemon does 10 damage to itself.'
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name: string = 'Erika\'s Oddish';
  public fullName: string = 'Erika\'s Oddish MC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const dealDamage = new DealDamageEffect(effect, 10);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }
    return state;
  }
}