import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game/store/card/pokemon-types';
import { CheckAttackCostEffect, CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { PlayerType, StateUtils } from '../../game';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, AFTER_ATTACK } from '../../game/store/prefabs/prefabs';

export class Florges extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Floette';

  public cardType: CardType = CardType.FAIRY;

  public hp: number = 110;

  public weakness = [{ type: CardType.METAL }];

  public resistance = [{ type: CardType.DARK, value: -20 }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Calming Aroma',
    powerType: PowerType.ABILITY,
    text: 'Each of your Pokémon\'s attacks costs [Y] less.'
  }];

  public attacks = [{
    name: 'Wonder Shine',
    cost: [CardType.FAIRY, CardType.FAIRY, CardType.FAIRY],
    damage: 70,
    text: 'Your opponent\'s Active Pokémon is now Confused.'
  }];

  public set: string = 'BKT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '103';

  public name: string = 'Florges';

  public fullName: string = 'Florges BKT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckAttackCostEffect) {
      const player = effect.player;
      const index = effect.cost.indexOf(CardType.FAIRY);

      let hasVirizionInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          hasVirizionInPlay = true;
        }
      });

      if (!hasVirizionInPlay) {
        return state;
      }

      // No cost to reduce
      if (index === -1) {
        return state;
      }

      if (hasVirizionInPlay == true) {

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

        const checkPokemonTypeEffect = new CheckPokemonTypeEffect(player.active);
        store.reduceEffect(state, checkPokemonTypeEffect);

        if (checkPokemonTypeEffect.cardTypes.includes(CardType.FAIRY)) {
          effect.cost.splice(index, 1);
        }

        return state;
      }
    }

    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
    }
    return state;
  }
}