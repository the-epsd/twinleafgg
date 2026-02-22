import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, GameMessage, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { BLOCK_IF_GX_ATTACK_USED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON } from '../../game/store/prefabs/attack-effects';

export class XerneasGX extends PokemonCard {
  public tags = [CardTag.POKEMON_GX];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = Y;
  public hp: number = 180;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Overrun',
      cost: [C],
      damage: 20,
      text: 'This attack does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Aurora Horns',
      cost: [Y, Y, C],
      damage: 120,
      text: ''
    },
    {
      name: 'Sanctuary-GX',
      cost: [Y, Y, C],
      damage: 0,
      gxAttack: true,
      text: 'Move all damage counters from each of your Pokémon to your opponent\'s Active Pokémon. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set: string = 'FLI';
  public name: string = 'Xerneas-GX';
  public fullName: string = 'Xerneas-GX FLI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '90';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Overrun
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(20, effect, store, state);
    }

    // Sanctuary-GX
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.getPrizeLeft() + opponent.getPrizeLeft() > 6) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      // Check if player has used GX attack
      BLOCK_IF_GX_ATTACK_USED(player);
      // set GX attack as used for game
      player.usedGX = true;

      let damageCounters = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, card => {
        damageCounters += card.damage;
        card.damage = 0;
      });
      opponent.active.damage += damageCounters;
    }
    return state;
  }
}