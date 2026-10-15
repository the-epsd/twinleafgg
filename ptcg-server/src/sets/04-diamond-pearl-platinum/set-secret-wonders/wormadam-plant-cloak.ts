import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckHpEffect, CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class WormadamPlantCloak extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Burmy Plant Cloak';
  public hp: number = 80;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +20 }];
  public retreat = [C];

  public powers = [{
    name: 'Plant Cloak',
    powerType: PowerType.POKEBODY,
    text: 'If Wormadam Plant Cloak has 2 or more Grass Energy attached to it, Wormadam Plant Cloak gets +40 HP.'
  }];

  public attacks = [{
    name: 'Leaf Hurricane',
    cost: [G, C, C],
    damage: 60,
    text: 'If the Defending Pokémon has fewer remaining HP than Wormadam Plant Cloak, the Defending Pokémon is now Confused.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '41';
  public name: string = 'Wormadam Plant Cloak';
  public fullName: string = 'Wormadam Plant Cloak SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Plant Cloak
    if (effect instanceof CheckHpEffect && effect.target.getPokemonCard() === this) {
      const owner = StateUtils.findOwner(state, effect.target);
      if (!StateUtils.isPokemonInPlay(owner, this) || IS_POKEBODY_BLOCKED(store, state, owner, this)) {
        return state;
      }

      const checkEnergy = new CheckProvidedEnergyEffect(owner, effect.target);
      store.reduceEffect(state, checkEnergy);
      const grassCount = checkEnergy.energyMap.reduce((sum, em) => {
        return sum + em.provides.filter(t => t === CardType.GRASS || t === CardType.ANY).length;
      }, 0);

      if (grassCount >= 2) {
        effect.hp += 40;
      }
    }

    // Leaf Hurricane
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      const checkMyHp = new CheckHpEffect(player, player.active);
      store.reduceEffect(state, checkMyHp);
      const myRemainingHp = checkMyHp.hp - player.active.damage;

      const checkOpponentHp = new CheckHpEffect(opponent, opponent.active);
      store.reduceEffect(state, checkOpponentHp);
      const opponentRemainingHp = checkOpponentHp.hp - opponent.active.damage;

      if (opponentRemainingHp < myRemainingHp) {
        ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, opponent, this);
      }
    }

    return state;
  }
}
