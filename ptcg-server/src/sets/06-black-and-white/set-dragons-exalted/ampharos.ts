import { PowerType, StateUtils, StoreLike } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { AttachEnergyEffect } from '../../../game/store/effects/play-card-effects';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON } from '../../../game/store/prefabs/attack-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { State } from '../../../game/store/state/state';

export class Ampharos extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Flaaffy';
  public cardType: CardType[] = [L];
  public hp: number = 140;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public powers = [{
    name: 'Electromagnetic Wall',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokemon is your Active Pokemon, whenever your opponent attaches an Energy from his or her hand to 1 of his or her Pokemon, put 3 damage counters on that Pokemon.'
  }];

  public attacks = [{
    name: 'Electrobullet',
    cost: [L, C, C],
    damage: 70,
    text: 'Does 20 damage to 1 of your opponent\'s Benched Pokemon. (Don\'t apply Weakness and Resistance for Benched Pokemon.)'
  }];

  public set: string = 'DRX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '40';
  public name: string = 'Ampharos';
  public fullName: string = 'Ampharos DRX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Electromagnetic Wall
    if (effect instanceof AttachEnergyEffect) {
      if (!effect.player.hand.cards.includes(effect.energyCard)) {
        return state;
      }

      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (!StateUtils.isPokemonInPlay(owner, this) || owner.active.getPokemonCard() !== this) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, owner, this)) {
        return state;
      }

      if (effect.player === owner) {
        return state;
      }

      store.reduceEffect(
        state,
        new PlaceDamageCountersEffect(owner, effect.target, 30, this, this.powers[0]),
      );
    }

    // Electrobullet
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(20, effect, store, state);
    }

    return state;
  }
}
