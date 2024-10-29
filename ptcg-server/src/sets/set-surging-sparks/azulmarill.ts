import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, PlayerType } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Azumarill extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Marill';

  public regulationMark = 'H';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 120;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Sparkly Bubbles',
    powerType: PowerType.ABILITY,
    text: 'If you have a Tera Pokémon in play, this Pokémon\'s Double Edge attack can be used for 1 Psychic Energy.'
  }];

  public attacks = [
    {
      name: 'Double Edge',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.PSYCHIC, CardType.PSYCHIC],
      damage: 230,
      text: 'This Pokémon does 50 damage to itself.'
    }
  ];

  public set: string = 'SSP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '74';

  public name: string = 'Azumarill';

  public fullName: string = 'Azumarill svLN';

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
          console.log(effect.cost);
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
      console.log(effect.cost);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 50);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }
    return state;
  }

}