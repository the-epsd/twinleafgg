import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StateUtils } from '../../game/store/state-utils';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { AttachPokemonToolEffect } from '../../game/store/effects/play-card-effects';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, AFTER_ATTACK, IS_POKEBODY_BLOCKED, MOVE_CARDS } from '../../game/store/prefabs/prefabs';
import { CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { PlayerType } from '../../game';

export class Aerodactylex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Mysterious Fossil';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = C;
  public hp: number = 100;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Primal Lock',
    powerType: PowerType.POKEBODY,
    text: 'As long as Aerodactyl ex is in play, your opponent can\'t play Pokémon Tool cards. Remove any Pokémon Tool cards attached to your opponent\'s Pokémon and put them into his or her discard pile.'
  }];

  public attacks = [{
    name: 'Supersonic',
    cost: [C],
    damage: 10,
    text: 'The Defending Pokémon is now Confused.'
  },
  {
    name: 'Wing Attack',
    cost: [C, C, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'SS';
  public name: string = 'Aerodactyl ex';
  public fullName: string = 'Aerodactyl ex SS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '94';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    // Block trainer cards
    if (effect instanceof AttachPokemonToolEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (!StateUtils.isPokemonInPlay(opponent, this)) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      if (IS_POKEBODY_BLOCKED(store, state, opponent, this)) {
        return state;
      }

      throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
    }

    if (effect instanceof CheckTableStateEffect) {
      state.players.forEach(player => {
        player.forEachPokemon(PlayerType.ANY, cardList => {
          if (cardList.cards.includes(this)) {
            const opponent = StateUtils.getOpponent(state, player);
            opponent.forEachPokemon(PlayerType.ANY, (cardList, card) => {
              if (cardList.tools.length > 0) {
                cardList.tools.forEach(tool => {
                  MOVE_CARDS(store, state, cardList, opponent.discard, { cards: [tool], sourceCard: this });
                });
              }
            });
          }
        });
      });
    }

    return state;
  }

}
