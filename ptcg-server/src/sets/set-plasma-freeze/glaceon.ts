import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../game/store/prefabs/attack-effects';

export class Glaceon extends PokemonCard {
  public tags = [CardTag.TEAM_PLASMA];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Eevee';
  public cardType: CardType = W;
  public hp: number = 90;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public powers = [{
    name: 'Freeze Zone',
    powerType: PowerType.ABILITY,
    text: 'The Retreat Cost of each of your Team Plasma Pokémon in play is ColorlessColorless less.'
  }];

  public attacks = [
    {
      name: 'Icy Wind',
      cost: [W, C, C],
      damage: 60,
      text: 'The Defending Pokémon is now Asleep.'
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '23';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Glaceon';
  public fullName: string = 'Glaceon PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ability: Freeze Zone (passive - retreat cost reduction)
    if (effect instanceof CheckRetreatCostEffect) {
      const player = effect.player;

      // Check if this Glaceon is in play on this player's side
      let isInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isInPlay = true;
        }
      });

      if (!isInPlay) {
        return state;
      }

      // Check if ability is blocked
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      // Check if the retreating Pokemon is a Team Plasma Pokemon
      const pokemonCard = player.active.getPokemonCard();
      if (pokemonCard && pokemonCard.tags.includes(CardTag.TEAM_PLASMA)) {
        // Remove up to 2 Colorless from cost
        for (let i = 0; i < 2; i++) {
          const index = effect.cost.indexOf(CardType.COLORLESS);
          if (index >= 0) {
            effect.cost.splice(index, 1);
          }
        }
      }
    }

    // Attack: Icy Wind
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
    }

    return state;
  }
}
