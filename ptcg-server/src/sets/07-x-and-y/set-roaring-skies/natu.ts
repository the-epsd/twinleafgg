import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { StoreLike, State, StateUtils, EnergyCard } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DELTA_PLUS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Natu extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 40;
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'Delta Plus',
    powerType: PowerType.ANCIENT_TRAIT,
    text: 'If your opponent\'s Pokemon is Knocked Out by damage from an ' +
      'attack of this Pokemon, take 1 more Prize card.'
  }];

  public attacks = [{
    name: 'Psywave',
    cost: [P, C],
    damage: 10,
    text: ' This attack does 10 damage times the amount of Energy attached to your opponent\'s Active Pokémon.'
  }];

  public set: string = 'ROS';
  public setNumber: string = '28';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Natu';
  public fullName: string = 'Natu ROS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Psywave
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentActivePokemon = opponent.active;

      let energyCount = 0;

      opponentActivePokemon.cards.forEach(c => {
        if (c instanceof EnergyCard) {
          energyCount++;
        }
      });
      effect.damage = energyCount * 10;
    }

    return DELTA_PLUS(store, state, effect, this);
  }
}