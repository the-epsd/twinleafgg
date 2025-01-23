import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StateUtils } from '../../game/store/state-utils';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { PlayItemEffect } from '../../game/store/effects/play-card-effects';
import {PlayerType} from '../../game';

export class Tyranitar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public evolvesFrom = 'Pupitar';
  public cardType: CardType = CardType.DARK;
  public hp: number = 190;
  public weakness = [{ type: CardType.GRASS }];
  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Daunting Gaze',
    powerType: PowerType.ABILITY,
    text: 'While this Pokémon is in the Active Spot, your opponent can’t play any Item cards from their hand.'
  }];

  public attacks = [{
    name: 'Crackling Stomp',
    cost: [ CardType.DARK, CardType.COLORLESS ],
    damage: 150,
    text: 'Discard the top 2 cards of your opponent’s deck.'
  }];

  public set: string = 'SV9';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '58';

  public name: string = 'Tyranitar';
  public fullName: string = 'Tyranitar SV9';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      
      opponent.deck.moveTo(opponent.discard, 2);
    }

    // beta vileplume gaming
    if (effect instanceof PlayItemEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let isTyranitarInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isTyranitarInPlay = true;
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card === this) {
          isTyranitarInPlay = true;
        }
      });

      if (!isTyranitarInPlay){
        return state;
      }

      if (player.active.getPokemonCard() === this && opponent.active.getPokemonCard() !== this){
        return state;
      }

      if (opponent.active.getPokemonCard() === this){
        // Try to reduce PowerEffect, to check if something is blocking our ability
        try {
          const powerEffect = new PowerEffect(player, this.powers[0], this);
          store.reduceEffect(state, powerEffect);
        } catch {
          return state;
        }

        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
      
    }

    return state;
  }

}
