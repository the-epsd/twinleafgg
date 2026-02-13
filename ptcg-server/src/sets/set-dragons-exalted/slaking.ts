import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED, IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON } from '../../game/store/prefabs/attack-effects';

export class Slaking extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Vigoroth';
  public cardType: CardType = C;
  public hp: number = 150;
  public weakness = [{ type: F }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Unobservant',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'If your opponent\'s Active Pokemon is a Basic Pokemon, this Pokemon can\'t attack.'
  }];

  public attacks = [
    {
      name: 'Crushing Blow',
      cost: [C, C, C, C],
      damage: 100,
      text: 'Discard an Energy attached to the Defending Pokemon.'
    }
  ];

  public set: string = 'DRX';
  public setNumber: string = '103';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Slaking';
  public fullName: string = 'Slaking DRX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ability: Unobservant - Can't attack if opponent's active is Basic
    if (effect instanceof AttackEffect && effect.player.active.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (!IS_ABILITY_BLOCKED(store, state, player, this)) {
        const opponentActive = opponent.active.getPokemonCard();
        if (opponentActive && opponentActive.stage === Stage.BASIC) {
          throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
        }
      }
    }

    // Attack: Crushing Blow - Discard an Energy from Defending Pokemon
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, state, effect);
    }

    return state;
  }
}
