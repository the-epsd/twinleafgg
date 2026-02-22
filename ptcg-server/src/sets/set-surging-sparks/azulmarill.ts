import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, PlayerType } from '../../game';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Azumarill extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Marill';
  public regulationMark = 'H';
  public cardType: CardType = P;
  public hp: number = 120;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public powers = [{
    name: 'Glistening Bubbles',
    powerType: PowerType.ABILITY,
    text: 'If you have any Tera Pokémon in play, this Pokémon can use the Double-Edge attack for [P].'
  }];

  public attacks = [
    {
      name: 'Double-Edge',
      cost: [P, P, P, P],
      damage: 230,
      text: 'This Pokémon does 50 damage to itself.'
    }
  ];

  public set: string = 'SSP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '74';
  public name: string = 'Azumarill';
  public fullName: string = 'Azumarill SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckAttackCostEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      let hasTeraPokemonInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.tags.includes(CardTag.POKEMON_TERA)) {
          hasTeraPokemonInPlay = true;
        }
      });

      if (hasTeraPokemonInPlay) {

        try {
          const stub = new PowerEffect(player, {
            name: 'test',
            powerType: PowerType.ABILITY,
            text: ''
          }, this);
          store.reduceEffect(state, stub);
        } catch {
          return state;
        }

        const index = effect.cost.indexOf(CardType.PSYCHIC);

        // No cost to reduce
        if (index === -1) {
          return state;
        }

        // Remove all PSYCHIC energy from the cost
        while (effect.cost.includes(CardType.PSYCHIC)) {
          const psychicIndex = effect.cost.indexOf(CardType.PSYCHIC);
          effect.cost.splice(psychicIndex, 3);
        }
      }
      return state;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {

      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 50);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }
    return state;
  }

}