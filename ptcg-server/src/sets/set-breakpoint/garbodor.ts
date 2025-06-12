import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { EffectOfAbilityEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StateUtils } from '../../game/store/state-utils';
import { PlayerType } from '../../game/store/actions/play-card-action';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, ADD_POISON_TO_PLAYER_ACTIVE, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PokemonCardList } from '../../game';

export class Garbodor extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Trubbish';
  public cardType: CardType = P;
  public hp: number = 100;
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Garbotoxin',
    powerType: PowerType.ABILITY,
    text: 'If this Pokemon has a Pokemon Tool card attached to it, each Pokemon in play, in each player\'s hand, and in each player\'s discard pile has no Abilities (except for Garbotoxin).'
  }];

  public attacks = [{
    name: 'Offensive Bomb',
    cost: [P, C, C, C],
    damage: 60,
    text: 'Your opponent\'s Active Pokemon is now Confused and Poisoned.'
  }];

  public set: string = 'BKP';
  public name: string = 'Garbodor';
  public fullName: string = 'Garbodor BKP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '57';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect
      && effect.power.powerType === PowerType.ABILITY
      && effect.power.name !== 'Garbotoxin') {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let playerHasGarbotoxin = false;
      let opponentHasGarbotoxin = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this && cardList.tool !== undefined) {
          playerHasGarbotoxin = true;
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card === this && cardList.tool !== undefined) {
          opponentHasGarbotoxin = true;
        }
      });

      if (!playerHasGarbotoxin && !opponentHasGarbotoxin) {
        return state;
      }

      // Try reducing ability for each player  
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      // Check if we can apply the Ability lock to target Pokemon
      const cardList = StateUtils.findCardList(state, effect.card);
      if (cardList instanceof PokemonCardList) {
        const canApplyAbility = new EffectOfAbilityEffect(playerHasGarbotoxin ? player : opponent, this.powers[0], this, cardList);
        store.reduceEffect(state, canApplyAbility);
        if (!canApplyAbility.target) {
          return state;
        }
      }

      // Apply Ability lock
      if (!effect.power.exemptFromAbilityLock) {
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
    }

    // Offensive Bomb
    if (WAS_ATTACK_USED(effect, 0, this)) {
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }

}
