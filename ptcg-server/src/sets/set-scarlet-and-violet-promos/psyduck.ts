import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { StoreLike, State, PowerType, GameError, GameMessage } from '../../game';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class Psyduck extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public retreat = [C];

  public powers = [{
    name: 'Damp',
    powerType: PowerType.ABILITY,
    text: 'Pokémon with an Ability that cause that Pokémon to Knock itself Out don\'t have that Ability.'
  }];

  public attacks = [{
    name: 'Ram',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'SVP';
  public setNumber = '262';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Psyduck';
  public fullName: string = 'Psyduck SVP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.ABILITY && effect.power.name !== 'Damp') {
      const player = effect.player;

      if (!effect.power.knocksOutSelf) {
        return state;
      }

      // Try reducing ability for each player  
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }
      if (!effect.power.exemptFromAbilityLock) {
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
    }
    return state;
  }
}
