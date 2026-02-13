import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Zekrom extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 130;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Mach Claw',
      cost: [L, C, C],
      damage: 50,
      text: 'This attack\'s damage isn\'t affected by Resistance.'
    },
    {
      name: 'Fusion Bolt',
      cost: [L, C, C, C],
      damage: 80,
      damageCalculation: '+' as const,
      text: 'If Reshiram is on your Bench, this attack does 40 more damage.'
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '39';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Zekrom';
  public fullName: string = 'Zekrom PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.ignoreResistance = true;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      let hasReshiram = false;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList === player.active) {
          return;
        }
        const pokemon = cardList.getPokemonCard();
        if (pokemon && pokemon.name === 'Reshiram') {
          hasReshiram = true;
        }
      });

      if (hasReshiram) {
        effect.damage += 40;
      }
    }

    return state;
  }
}
