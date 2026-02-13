import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayerType, StoreLike, State } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_DAMAGE_PER_HEADS } from '../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Boldore extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Roggenrola';
  public cardType: CardType = F;
  public hp: number = 90;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Rock Cannon',
      cost: [F],
      damage: 30,
      damageCalculation: 'x' as 'x',
      text: 'Flip a coin until you get tails. This attack does 30 damage times the number of heads.'
    },
    {
      name: 'Earthquake',
      cost: [F, C, C],
      damage: 60,
      text: 'Does 10 damage to each of your Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'DRX';
  public setNumber: string = '66';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Boldore';
  public fullName: string = 'Boldore DRX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Rock Cannon
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_DAMAGE_PER_HEADS(store, state, effect, 30);
    }

    // Earthquake - 10 damage to each of your own Benched Pokemon
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList === player.active) {
          return;
        }
        const damage = new PutDamageEffect(effect, 10);
        damage.target = cardList;
        store.reduceEffect(state, damage);
      });
    }

    return state;
  }
}
