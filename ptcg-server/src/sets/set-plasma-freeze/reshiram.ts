import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Reshiram extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 130;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Purifying Flame',
      cost: [R, C, C],
      damage: 50,
      text: 'Remove all Special Conditions from this Pokémon.'
    },
    {
      name: 'Fusion Flare',
      cost: [R, C, C, C],
      damage: 80,
      damageCalculation: '+' as const,
      text: 'If Zekrom is on your Bench, this attack does 40 more damage.'
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '17';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Reshiram';
  public fullName: string = 'Reshiram PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      player.active.clearAllSpecialConditions();
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      let hasZekrom = false;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList === player.active) {
          return;
        }
        const pokemon = cardList.getPokemonCard();
        if (pokemon && pokemon.name === 'Zekrom') {
          hasZekrom = true;
        }
      });

      if (hasZekrom) {
        effect.damage += 40;
      }
    }

    return state;
  }
}
