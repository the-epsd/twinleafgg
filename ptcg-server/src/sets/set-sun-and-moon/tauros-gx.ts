import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { BLOCK_IF_GX_ATTACK_USED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class TaurosGX extends PokemonCard {
  public tags = [CardTag.POKEMON_GX];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 180;
  public weakness = [{ type: F }];
  public retreat = [ C, C, C ];

  public attacks = [
    {
      name: 'Rage',
      cost: [C, C],
      damage: 20,
      damageCalculation: '+',
      text: 'This attack does 10 more damage for each damage counter on this Pokémon.'
    },
    {
      name: 'Horn Attack',
      cost: [C, C],
      damage: 60,
      text: ''
    },
    {
      name: 'Mad Bull-GX',
      cost: [C, C],
      damage: 30,
      damageCalculation: 'x',
      gxAttack: true,
      text: 'This attack does 30 damage for each damage counter on this Pokémon. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set: string = 'SUM';
  public setNumber: string = '100';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Tauros-GX';
  public fullName: string = 'Tauros-GX SUM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Rage
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.damage += effect.player.active.damage;
    }

    // Mad Bull-GX
    if (WAS_ATTACK_USED(effect, 2, this)) {
      const player = effect.player;

      // Check if player has used GX attack
      BLOCK_IF_GX_ATTACK_USED(player);
      // set GX attack as used for game
      player.usedGX = true;

      effect.damage = player.active.damage * 3;
    }

    return state;
  }
}