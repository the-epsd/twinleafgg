import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StateUtils } from '../../game/store/state-utils';
import { PlayerType } from '../../game/store/actions/play-card-action';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';

export class Sceptileex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Grovyle';
  public tags = [CardTag.POKEMON_ex, CardTag.DELTA_SPECIES];
  public cardType: CardType = P;
  public hp: number = 140;
  public weakness = [{ type: G }, { type: R }];
  public resistance = [{ type: W, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Extra Liquid',
    powerType: PowerType.POKEBODY,
    text: 'Each player\'s Pokémon-ex can\'t use any Poké-Powers and pays [C] more Energy to use its attacks. Each Pokémon can\'t be affected by more than 1 Extra Liquid Poké-Body.'
  }];

  public attacks = [{
    name: 'Power Revenge',
    cost: [P, C],
    damage: 60,
    damageCalculation: '+',
    text: 'Does 60 damage plus 10 more damage for each Prize card your opponent has taken.'
  }];

  public set: string = 'CG';
  public name: string = 'Sceptile ex';
  public fullName: string = 'Sceptile ex CG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '96';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Extra Liquid
    // Power blocker
    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.POKEPOWER) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let playerHasExtraLiquid = false;
      let opponentHasExtraLiquid = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          playerHasExtraLiquid = true;
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card === this) {
          opponentHasExtraLiquid = true;
        }
      });

      if (!playerHasExtraLiquid && !opponentHasExtraLiquid) {
        return state;
      }

      // Try reducing ability for each player  
      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      if (effect.card.tags.includes(CardTag.POKEMON_ex)) {
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
    }

    // Increase attack cost
    if (effect instanceof CheckAttackCostEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      let playerHasExtraLiquid = false;
      let opponentHasExtraLiquid = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          playerHasExtraLiquid = true;
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card === this) {
          opponentHasExtraLiquid = true;
        }
      });

      if (!playerHasExtraLiquid && !opponentHasExtraLiquid) {
        return state;
      }

      // Check if ex is in the active position
      if (player.active.getPokemonCard()?.tags.includes(CardTag.POKEMON_ex)) {

        const index = effect.cost.indexOf(CardType.COLORLESS);
        if (index > -1) {
          effect.cost.splice(index, 0, CardType.COLORLESS);
        } else {
          effect.cost.push(CardType.COLORLESS);
        }

        return state;
      }
    }

    // Offensive Bomb
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const prizesTaken = 6 - opponent.getPrizeLeft();
      const damagePerPrize = 10;

      effect.damage += (prizesTaken * damagePerPrize);
    }

    return state;
  }

}
