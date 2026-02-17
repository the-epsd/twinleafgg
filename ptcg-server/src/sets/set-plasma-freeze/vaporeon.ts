import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PlayerType, StateUtils, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Vaporeon extends PokemonCard {
  public tags = [CardTag.TEAM_PLASMA];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Eevee';
  public cardType: CardType = W;
  public hp: number = 110;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Refreshing Rain',
      cost: [C],
      damage: 0,
      text: 'Heal 30 damage from each of your Pokémon.'
    },
    {
      name: 'Gold Breaker',
      cost: [W, C],
      damage: 30,
      damageCalculation: '+' as const,
      text: 'If the Defending Pokémon is a Pokémon-EX, this attack does 50 more damage.'
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '20';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Vaporeon';
  public fullName: string = 'Vaporeon PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.damage > 0) {
          const healEffect = new HealEffect(player, cardList, 30);
          store.reduceEffect(state, healEffect);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const defending = opponent.active.getPokemonCard();
      if (defending && defending.tags.includes(CardTag.POKEMON_EX)) {
        effect.damage += 50;
      }
    }

    return state;
  }
}
