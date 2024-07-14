import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';

export class Absol extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.DARK;
  public hp: number = 100;
  public weakness = [{ type: CardType.FIGHTING }];
  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];
  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Dark Ambition',
    powerType: PowerType.ABILITY,
    text: ' If your opponent\'s Active Pokémon is a Basic Pokémon, its Retreat Cost is [C] more.'
  }];

  public attacks = [{
    name: 'Shadow Seeker',
    cost: [CardType.DARK, CardType.COLORLESS, CardType.COLORLESS],
    damage: 30,
    text: 'This attack does 30 more damage for each [C] in your opponent\'s Active Pokémon\'s Retreat Cost. '
  }];

  public set = 'TEU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '88';
  public name = 'Absol';
  public fullName = 'Absol TEU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckRetreatCostEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let isAbsolInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isAbsolInPlay = true;
        }
      });

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card === this) {
          isAbsolInPlay = true;
        }
      });

      if (!isAbsolInPlay) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
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

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, cardList => {
        if (cardList.getPokemonCard()?.stage === Stage.BASIC) {
          // Add 1 more Colorless energy to the opponent's Active Pokemon's retreat cost
          effect.cost.push(CardType.COLORLESS);
        }
      });

    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const opponentActiveCard = opponent.active.getPokemonCard();
      if (opponentActiveCard) {
        const retreatCost = opponentActiveCard.retreat.filter(c => c === CardType.COLORLESS).length;

        effect.damage += retreatCost * 30;

        return state;
      }
    }

    return state;
  }
}