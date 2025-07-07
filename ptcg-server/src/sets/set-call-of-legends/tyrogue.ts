import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Tyrogue extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 30;
  public retreat = [];

  public powers = [{
    name: 'Sweet Sleeping Face',
    powerType: PowerType.POKEBODY,
    text: 'As long as Tyrogue is Asleep, prevent all damage done to Tyrogue by attacks.'
  }];

  public attacks = [{
    name: 'Mischievous Punch',
    cost: [],
    damage: 30,
    text: 'This attack\'s damage isn\'t affected by Weakness or Resistance. Tyrogue is now Asleep.'
  }];

  public set: string = 'CL';
  public name: string = 'Tyrogue';
  public fullName: string = 'Tyrogue CL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '36';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect) {
      const player = StateUtils.findOwner(state, effect.target);

      if (effect.target.cards.includes(this)
        && effect.target.getPokemonCard() === this
        && player.active.cards[0] === this
        && player.active.specialConditions.includes(SpecialCondition.ASLEEP)
        && !IS_POKEBODY_BLOCKED(store, state, player, this)) {

        effect.damage = 0;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      effect.ignoreResistance = true;
      effect.ignoreWeakness = true;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addSpecialCondition(SpecialCondition.ASLEEP);
        }
      });
    }

    return state;
  }

}