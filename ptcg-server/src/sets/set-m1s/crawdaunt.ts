import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';

export class Crawdaunt extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Corphish';
  public cardType: CardType = D;
  public hp: number = 130;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Vice Grip',
    cost: [C],
    damage: 30,
    text: ''
  },
  {
    name: 'Vengeful Scissors',
    cost: [D, D, C],
    damage: 130,
    text: 'If this Pokémon has any damage counters on it, this attack can be used for [D].'
  }];

  public set: string = 'M1L';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '37';
  public name: string = 'Crawdaunt';
  public fullName: string = 'Crawdaunt M1L';
  public regulationMark: string = 'I';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckAttackCostEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;


      let hasDamageCounters = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this && cardList.damage > 0) {
          hasDamageCounters = true;
        }
      });

      if (hasDamageCounters) {
        this.attacks[1].cost = [D];
      }
    }

    return state;
  }
}

