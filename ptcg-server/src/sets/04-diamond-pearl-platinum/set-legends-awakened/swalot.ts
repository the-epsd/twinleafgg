import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from '../../../game/store/prefabs/attack-effects';
import { CheckHpEffect } from '../../../game/store/effects/check-effects';

export class Swalot extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Gulpin';
  public hp: number = 90;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Swallow Up',
    cost: [P, C],
    damage: 30,
    text: 'Before doing damage, count the remaining HP of the Defending Pokémon and Swalot. If the Defending Pokémon has fewer remaining HP than Swalot\'s, this attack does 80 damage instead.'
  },
  {
    name: 'Gunk Shot',
    cost: [P, P, C],
    damage: 60,
    text: 'The Defending Pokémon is now Poisoned.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '72';
  public name: string = 'Swalot';
  public fullName: string = 'Swalot LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Swallow Up
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const checkMyHp = new CheckHpEffect(player, player.active);
      store.reduceEffect(state, checkMyHp);
      const myRemainingHp = checkMyHp.hp - player.active.damage;
      const checkOpponentHp = new CheckHpEffect(opponent, opponent.active);
      store.reduceEffect(state, checkOpponentHp);
      const opponentRemainingHp = checkOpponentHp.hp - opponent.active.damage;
      if (opponentRemainingHp < myRemainingHp) {
      effect.damage = 60;
      }
    }

    // Gunk Shot
    if (WAS_ATTACK_USED(effect, 1, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
    }

    return state;
  }
}
