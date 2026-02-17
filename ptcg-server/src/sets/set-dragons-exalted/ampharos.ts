import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { WAS_ATTACK_USED, IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON } from '../../game/store/prefabs/attack-effects';

export class Ampharos extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Flaaffy';
  public cardType: CardType = L;
  public hp: number = 140;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public powers = [{
    name: 'Electromagnetic Wall',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokemon is your Active Pokemon, whenever your opponent attaches an Energy from his or her hand to 1 of his or her Pokemon, put 3 damage counters on that Pokemon.'
  }];

  public attacks = [
    {
      name: 'Electrobullet',
      cost: [L, C, C],
      damage: 70,
      text: 'Does 20 damage to 1 of your opponent\'s Benched Pokemon. (Don\'t apply Weakness and Resistance for Benched Pokemon.)'
    }
  ];

  public set: string = 'DRX';
  public setNumber: string = '40';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Ampharos';
  public fullName: string = 'Ampharos DRX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ability: Electromagnetic Wall - damage when opponent attaches energy from hand
    if (effect instanceof AttachEnergyEffect) {
      // Only trigger on energy from hand
      if (!effect.player.hand.cards.includes(effect.energyCard)) {
        return state;
      }

      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      // Must be in play and active
      if (!StateUtils.isPokemonInPlay(owner, this) || !owner.active.cards.includes(this)) {
        return state;
      }

      // Check if ability is blocked
      if (IS_ABILITY_BLOCKED(store, state, owner, this)) {
        return state;
      }

      // Only trigger on opponent's energy attachments
      if (effect.player === owner) {
        return state;
      }

      // Put 3 damage counters on the Pokemon that energy is being attached to
      effect.target.damage += 30;
    }

    // Attack: Electrobullet - 70 to active, 20 to a benched
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(20, effect, store, state);
    }

    return state;
  }
}
