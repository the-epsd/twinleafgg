import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Nidoking extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Nidorino';
  public cardType: CardType = F;
  public hp: number = 140;
  public weakness = [{ type: W }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Lovestrike',
      cost: [C, C],
      damage: 20,
      damageCalculation: '+' as const,
      text: 'Does 40 more damage for each Nidoqueen on your Bench.'
    },
    {
      name: 'Horn Drill',
      cost: [F, C, C, C],
      damage: 90,
      text: ''
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '58';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Nidoking';
  public fullName: string = 'Nidoking PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      let nidoqueenCount = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList === player.active) {
          return;
        }
        const pokemon = cardList.getPokemonCard();
        if (pokemon && pokemon.name === 'Nidoqueen') {
          nidoqueenCount++;
        }
      });

      effect.damage += nidoqueenCount * 40;
    }

    return state;
  }
}
