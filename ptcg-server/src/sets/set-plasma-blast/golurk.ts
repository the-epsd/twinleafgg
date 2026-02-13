import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PlayerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Golurk extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Golett';
  public cardType: CardType = P;
  public hp: number = 130;
  public weakness = [{ type: D }];
  public retreat = [C, C, C, C];

  public attacks = [
    {
      name: 'Iron Fist of Justice',
      cost: [C, C],
      damage: 60,
      text: 'If you have any Team Plasma Pokémon in play, this attack does nothing.'
    },
    {
      name: 'Shadow Punch',
      cost: [P, P, C, C],
      damage: 80,
      text: 'This attack\'s damage isn\'t affected by Resistance.'
    }
  ];

  public set: string = 'PLB';
  public setNumber: string = '46';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Golurk';
  public fullName: string = 'Golurk PLB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Iron Fist of Justice
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      let hasTeamPlasma = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        const pokemon = cardList.getPokemonCard();
        if (pokemon && pokemon.tags.includes(CardTag.TEAM_PLASMA)) {
          hasTeamPlasma = true;
        }
      });

      if (hasTeamPlasma) {
        effect.damage = 0;
      }
    }

    // Attack 2: Shadow Punch
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.ignoreResistance = true;
    }

    return state;
  }
}
